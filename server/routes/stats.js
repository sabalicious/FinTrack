const express = require('express');
const router = express.Router();
const pool = require('../db');
const knex = require('../knex');
const authMiddleware = require('../middleware/authMiddleware');

// Get dashboard statistics
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Get total balance across all accounts
    const balanceRow = await knex('accounts')
      .where({ user_id: req.user.id, is_active: true })
      .sum('current_balance as total_balance')
      .first();
    const totalBalance = parseFloat(balanceRow.total_balance || 0);

    // Get income and expense for current month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const incomeExpenseRow = await knex('transactions')
      .where('user_id', req.user.id)
      .whereBetween('date_created', [monthStart, monthEnd])
      .sum({ total_income: knex.raw("CASE WHEN type = 'income' THEN amount ELSE 0 END") })
      .sum({ total_expense: knex.raw("CASE WHEN type = 'expense' THEN amount ELSE 0 END") })
      .first();

    const totalIncome = parseFloat(incomeExpenseRow.total_income || 0);
    const totalExpense = parseFloat(incomeExpenseRow.total_expense || 0);
    const netBalance = totalIncome - totalExpense;

    // Get spending by category (current month)
    const categoryRows = await knex('transactions as t')
      .join('categories as c', 't.category_id', 'c.id')
      .select('c.id', 'c.name')
      .where('t.user_id', req.user.id)
      .andWhere('t.type', 'expense')
      .whereBetween('t.date_created', [monthStart, monthEnd])
      .sum({ spent: 't.amount' })
      .groupBy('c.id', 'c.name')
      .orderBy('spent', 'desc')
      .limit(5);

    const categorySpending = categoryRows.map(row => ({ ...row, spent: parseFloat(row.spent) }));

    // Get budget status
    const budgetRows = await knex('budgets as b')
      .leftJoin('transactions as t', function () {
        this.on('b.category_id', 't.category_id')
          .andOn('t.user_id', 'b.user_id')
          .andOn(knex.raw("t.type = 'expense'"))
          .andOn('t.date_created', '>=', 'b.start_date')
          .andOn(knex.raw('(b.end_date IS NULL OR t.date_created <= b.end_date)'));
      })
      .join('categories as c', 'b.category_id', 'c.id')
      .where('b.user_id', req.user.id)
      .andWhere('b.is_active', true)
      .groupBy('b.id', 'b.category_id', 'c.name', 'b.limit_amount')
      .select('b.id', 'b.category_id', 'c.name as category_name', 'b.limit_amount')
      .sum({ spent_amount: 't.amount' })
      .orderBy('b.created_at', 'desc');

    const budgetStatus = budgetRows.map(row => ({
      id: row.id.toString(),
      category_id: row.category_id.toString(),
      category_name: row.category_name,
      limit_amount: parseFloat(row.limit_amount),
      spent_amount: parseFloat(row.spent_amount || 0),
      percentage: Math.round((parseFloat(row.spent_amount || 0) / parseFloat(row.limit_amount || 1)) * 100),
      isOverBudget: parseFloat(row.spent_amount || 0) > parseFloat(row.limit_amount || 0),
    }));

    // Get recent transactions
    const recentRows = await knex('transactions as t')
      .select('t.*', 'c.name as category_name')
      .leftJoin('categories as c', 't.category_id', 'c.id')
      .where('t.user_id', req.user.id)
      .orderBy('t.date_created', 'desc')
      .limit(10);

    const recentTransactions = recentRows.map(t => ({ ...t, amount: parseFloat(t.amount), id: t.id.toString() }));

    // Get pending transfers
    const pendingRows = await knex('transfers as t')
      .select('t.*', 'fu.email as from_email', 'tu.email as to_email')
      .join('users as fu', 't.from_user_id', 'fu.id')
      .join('users as tu', 't.to_user_id', 'tu.id')
      .where(function () {
        this.where('t.from_user_id', req.user.id).orWhere('t.to_user_id', req.user.id);
      })
      .andWhere('t.status', 'pending')
      .orderBy('t.created_at', 'desc')
      .limit(5);

    const pendingTransfers = pendingRows.map(t => ({ ...t, amount: parseFloat(t.amount), id: t.id.toString() }));

    res.json({
      summary: {
        totalBalance,
        totalIncome,
        totalExpense,
        netBalance,
        currentMonth: monthStart.toISOString().substring(0, 7),
      },
      categorySpending,
      budgetStatus,
      recentTransactions,
      pendingTransfers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get statistics for a specific period
router.get('/period/:period', authMiddleware, async (req, res) => {
  try {
    const { period } = req.params; // day, week, month, year
    const now = new Date();
    let startDate, endDate;

    switch (period) {
      case 'day':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay());
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        return res.status(400).json({ error: 'Invalid period' });
    }

    const agg = await knex('transactions')
      .where('user_id', req.user.id)
      .whereBetween('date_created', [startDate, endDate])
      .sum({ total_income: knex.raw("CASE WHEN type = 'income' THEN amount ELSE 0 END") })
      .sum({ total_expense: knex.raw("CASE WHEN type = 'expense' THEN amount ELSE 0 END") })
      .count({ transaction_count: '*' })
      .first();

    res.json({
      period,
      startDate,
      endDate,
      totalIncome: parseFloat(agg.total_income || 0),
      totalExpense: parseFloat(agg.total_expense || 0),
      netBalance: parseFloat(agg.total_income || 0) - parseFloat(agg.total_expense || 0),
      transactionCount: parseInt(agg.transaction_count || 0),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
