import React, { useState, useEffect } from 'react'
import mockUser from './mockData.js/mockUser'
import mockRepos from './mockData.js/mockRepos'
import mockFollowers from './mockData.js/mockFollowers'
import axios from 'axios'

const rootUrl = 'https://api.github.com'

const GithubContext = React.createContext()

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser)
  const [repos, setRepos] = useState(mockRepos)
  const [followers, setFollowers] = useState(mockFollowers)
  const [loading, setLoading] = useState(false)
  const [request, setRequest] = useState(0)
  const [error, setError] = useState({ show: false, msg: '' })

  const checkRequest = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data
        setRequest(remaining)
        if (remaining === 0) {
          toggleError(true, 'sorry you have exausted your hourly rate limit')
        }
      })
      .catch((err) =>
        toggleError(true, 'sorry you have exausted your hourly rate limit')
      )
  }
  const toggleError = (show, msg) => {
    setError({ show, msg })
  }

  const searchGithubUser = async (user) => {
    setLoading(true)
    const response = await axios(`${rootUrl}/users/${user}`).catch((error) => {
      console.log(error)
    })
    if (response) {
      setGithubUser(response.data)
    } else {
      toggleError(true, 'user not found')
    }
    setLoading(false)
  }
  useEffect(checkRequest, [])

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        request,
        loading,
        error,
        searchGithubUser,
      }}
    >
      {children}
    </GithubContext.Provider>
  )
}

export { GithubProvider, GithubContext }
