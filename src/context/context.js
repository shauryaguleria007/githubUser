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
      const { login, followers_url } = response.data
      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_person`),
        axios(`${followers_url}?per_person`),
      ])
        .then((result) => {
          const [repos, followers] = result
          console.log(repos)
          const status = 'fulfilled'
          if (repos.status === status) {
            setRepos(repos.value.data)
          }
          if (followers.status === status) {
            setFollowers(followers.value.data)
          }
        })
        .catch((error) => {
          console.log(error)
        })
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
