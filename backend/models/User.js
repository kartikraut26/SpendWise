const mongoose =
  require('mongoose')


const preferencesSchema =
  new mongoose.Schema(
    {

      currency: {
        type: String,

        enum: [
          'INR',
          'USD',
          'EUR',
          'GBP'
        ],

        default: 'INR'
      },

      theme: {
        type: String,

        enum: [
          'light',
          'dark'
        ],

        default: 'light'
      },

      budgetAlerts: {
        type: Boolean,
        default: true
      },

      subscriptionReminders: {
        type: Boolean,
        default: true
      },

      monthlySummary: {
        type: Boolean,
        default: true
      }

    },

    {
      _id: false
    }
  )


const userSchema =
  new mongoose.Schema(
    {

      /*
       * This is the Keycloak JWT `sub`.
       *
       * One Keycloak account = one SpendWise profile.
       */
      keycloakId: {
        type: String,

        required: true,

        unique: true,

        index: true
      },


      email: {
        type: String,

        trim: true,

        lowercase: true,

        default: ''
      },


      firstName: {
        type: String,

        trim: true,

        default: ''
      },


      lastName: {
        type: String,

        trim: true,

        default: ''
      },


      displayName: {
        type: String,

        trim: true,

        default: ''
      },


      avatar: {
        type: String,

        default: ''
      },


      preferences: {
        type: preferencesSchema,

        default: () => ({})
      }

    },

    {
      timestamps: true
    }
  )


module.exports =
  mongoose.model(
    'User',
    userSchema
  )