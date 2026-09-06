import {
  computed,
  ref
} from 'vue'

import {
  defineStore
} from 'pinia'

import api from '../services/api'


export const useFinanceStore =
  defineStore(
    'finance',
    () => {

      const transactions =
        ref([])


      const budgets =
        ref([
          {
            category: 'Food',
            spent: 7200,
            limit: 10000
          },

          {
            category: 'Transport',
            spent: 2250,
            limit: 5000
          },

          {
            category: 'Entertainment',
            spent: 1800,
            limit: 3000
          }
        ])


      const savingsGoal =
        ref({
          title: 'New Laptop',

          current: 45000,

          target: 60000
        })


      const totalIncome =
        computed(() =>

          transactions.value

            .filter(
              transaction =>
                transaction.type ===
                'income'
            )

            .reduce(
              (
                total,
                transaction
              ) =>
                total +
                Number(
                  transaction.amount
                ),

              0
            )
        )


      const totalExpenses =
        computed(() =>

          transactions.value

            .filter(
              transaction =>
                transaction.type ===
                'expense'
            )

            .reduce(
              (
                total,
                transaction
              ) =>
                total +
                Number(
                  transaction.amount
                ),

              0
            )
        )


      const totalBalance =
        computed(
          () =>
            totalIncome.value -
            totalExpenses.value
        )


      const savings =
        computed(() =>
          Math.max(
            totalBalance.value,
            0
          )
        )


      const savingsPercentage =
        computed(() => {

          if (
            savingsGoal.value.target <=
            0
          ) {
            return 0
          }

          return Math.min(

            Math.round(

              (
                savingsGoal.value.current /
                savingsGoal.value.target
              ) * 100

            ),

            100
          )
        })


      async function fetchTransactions() {

        try {

          const response =
            await api.get(
              '/transactions'
            )


          const data =
            response.data.data ||
            []


          transactions.value =
            data.map(
              transaction => ({

                id:
                  transaction._id,

                title:
                  transaction.description,

                category:
                  transaction.categoryId ||
                  'Other',

                amount:
                  Number(
                    transaction.amount
                  ),

                type:
                  transaction.type,

                date:
                  formatDate(
                    transaction.date
                  ),

                icon:
                  getTransactionIcon(
                    transaction.categoryId,
                    transaction.type
                  )
              })
            )

        } catch (error) {

          console.error(
            'Failed to fetch dashboard transactions:',
            error
          )

          transactions.value = []

          throw error
        }
      }


      async function addTransaction(
        transaction
      ) {

        try {

          const response =
            await api.post(

              '/transactions',

              {

                type:
                  transaction.type,

                amount:
                  Number(
                    transaction.amount
                  ),

                description:
                  transaction.description,

                categoryId:
                  transaction.categoryId ||
                  transaction.category ||
                  'Other',

                date:
                  transaction.date ||
                  new Date()
                    .toISOString()
              }
            )


          const created =
            response.data.data


          const formattedTransaction =
            {

              id:
                created._id,

              title:
                created.description,

              category:
                created.categoryId ||
                'Other',

              amount:
                Number(
                  created.amount
                ),

              type:
                created.type,

              date:
                formatDate(
                  created.date
                ),

              icon:
                getTransactionIcon(
                  created.categoryId,
                  created.type
                )
            }


          transactions.value.unshift(
            formattedTransaction
          )


          updateBudget(
            formattedTransaction
          )


          return formattedTransaction

        } catch (error) {

          console.error(
            'Failed to add transaction:',
            error
          )

          throw error
        }
      }


      function updateBudget(
        transaction
      ) {

        if (
          transaction.type !==
          'expense'
        ) {
          return
        }


        const category =
          normaliseCategory(
            transaction.category
          )


        const budget =
          budgets.value.find(

            item =>

              normaliseCategory(
                item.category
              ) === category
          )


        if (budget) {

          budget.spent +=
            Number(
              transaction.amount
            )
        }
      }


      function normaliseCategory(
        category
      ) {

        return String(
          category || ''
        )

          .toLowerCase()

          .replace(
            /\s+/g,
            ''
          )
      }


      function getTransactionIcon(
        category,
        type
      ) {

        if (
          type === 'income'
        ) {
          return 'wallet'
        }


        const value =
          String(
            category || ''
          ).toLowerCase()


        if (
          value.includes('food') ||
          value.includes('grocery')
        ) {
          return 'food'
        }


        if (
          value.includes('transport') ||
          value.includes('petrol') ||
          value.includes('travel')
        ) {
          return 'transport'
        }


        if (
          value.includes(
            'subscription'
          ) ||
          value.includes(
            'netflix'
          ) ||
          value.includes(
            'entertainment'
          )
        ) {
          return 'subscription'
        }


        return 'receipt'
      }


      function formatDate(
        date
      ) {

        if (!date) {
          return 'Today'
        }


        const transactionDate =
          new Date(date)


        const today =
          new Date()


        if (
          transactionDate
            .toDateString() ===
          today.toDateString()
        ) {
          return 'Today'
        }


        const yesterday =
          new Date(today)


        yesterday.setDate(
          today.getDate() - 1
        )


        if (
          transactionDate
            .toDateString() ===
          yesterday.toDateString()
        ) {
          return 'Yesterday'
        }


        return transactionDate
          .toLocaleDateString(
            'en-IN',
            {
              day: 'numeric',
              month: 'short'
            }
          )
      }


      return {

        transactions,

        budgets,

        savingsGoal,

        totalIncome,

        totalExpenses,

        totalBalance,

        savings,

        savingsPercentage,

        fetchTransactions,

        addTransaction
      }

    }
  )