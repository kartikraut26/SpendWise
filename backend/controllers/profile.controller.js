const User =
  require('../models/User')


function getTokenDisplayName(
  token
) {

  return (
    token.name ||

    [
      token.given_name,
      token.family_name
    ]
      .filter(Boolean)
      .join(' ') ||

    token.preferred_username ||

    token.email ||

    'User'
  )

}


/*
 * GET /api/profile/me
 *
 * Gets the profile belonging ONLY
 * to the currently authenticated
 * Keycloak account.
 */
async function getProfile(
  req,
  res
) {

  const keycloakId =
    req.user.id

  const token =
    req.user


  let user =
    await User.findOne({
      keycloakId
    })


  /*
   * First login:
   * create exactly one SpendWise
   * profile for this Keycloak account.
   */
  if (!user) {

    user =
      await User.create({

        keycloakId,

        email:
          token.email ||
          '',

        firstName:
          token.given_name ||
          '',

        lastName:
          token.family_name ||
          '',

        displayName:
          getTokenDisplayName(
            token
          )

      })

  } else {

    /*
     * Keep email synchronized with
     * the identity provider.
     */
    const tokenEmail =
      token.email
        ? token.email.toLowerCase()
        : ''


    if (
      tokenEmail &&
      user.email !== tokenEmail
    ) {

      user.email =
        tokenEmail

      await user.save()

    }

  }


  res.status(200).json({

    success: true,

    data: user

  })

}


/*
 * PATCH /api/profile/me
 *
 * Updates the profile belonging ONLY
 * to the current authenticated account.
 */
async function updateProfile(
  req,
  res
) {

  const keycloakId =
    req.user.id

  const token =
    req.user


  let user =
    await User.findOne({
      keycloakId
    })


  /*
   * Handle a profile update even if
   * this is the first API request made
   * by the account.
   */
  if (!user) {

    user =
      new User({

        keycloakId,

        email:
          token.email ||
          '',

        firstName:
          token.given_name ||
          '',

        lastName:
          token.family_name ||
          '',

        displayName:
          getTokenDisplayName(
            token
          )

      })

  }


  /*
   * Personal information
   */
  if (
    req.body.firstName !==
    undefined
  ) {

    user.firstName =
      String(
        req.body.firstName
      )
        .trim()
        .slice(0, 60)

  }


  if (
    req.body.lastName !==
    undefined
  ) {

    user.lastName =
      String(
        req.body.lastName
      )
        .trim()
        .slice(0, 60)

  }


  if (
    req.body.displayName !==
    undefined
  ) {

    const displayName =
      String(
        req.body.displayName
      )
        .trim()
        .slice(0, 100)


    if (!displayName) {

      return res.status(400).json({

        success: false,

        message:
          'Display name cannot be empty.'

      })

    }


    user.displayName =
      displayName

  }


  /*
   * Account preferences
   */
  if (
    req.body.preferences &&
    typeof req.body.preferences ===
      'object'
  ) {

    const preferences =
      req.body.preferences


    if (
      preferences.currency !==
      undefined
    ) {

      if (
        ![
          'INR',
          'USD',
          'EUR',
          'GBP'
        ].includes(
          preferences.currency
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            'Unsupported currency.'

        })

      }


      user.preferences.currency =
        preferences.currency

    }


    if (
      preferences.theme !==
      undefined
    ) {

      if (
        ![
          'light',
          'dark'
        ].includes(
          preferences.theme
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            'Unsupported theme.'

        })

      }


      user.preferences.theme =
        preferences.theme

    }


    const booleanPreferences = [
      'budgetAlerts',
      'subscriptionReminders',
      'monthlySummary'
    ]


    for (
      const key
      of booleanPreferences
    ) {

      if (
        preferences[key] !==
        undefined
      ) {

        user.preferences[key] =
          Boolean(
            preferences[key]
          )

      }

    }

  }


  await user.save()


  res.status(200).json({

    success: true,

    message:
      'Profile updated successfully.',

    data: user

  })

}


module.exports = {

  getProfile,

  updateProfile

}