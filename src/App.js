import React, { Component } from 'react'
import { Router, Link, Redirect } from '@reach/router'
import { baseUrl, HEADERS } from './constants'
import {
  Container,
  Segment,
  Header,
  Menu,
  Button,
  Message,
} from 'semantic-ui-react'
import PlayerContainer from './containers/PlayerContainer'
import GroupContainer from './containers/GroupContainer'
import SessionContainer from './containers/SessionContainer'
import LoginForm from './components/LoginForm'
import CalculateRatings from './components/CalculateRatings'

export default class App extends Component {
  state = {
    loading: false,
    activeItem: 'players',
    groups: [],
    players: [],
    loggedIn: false,
    error: '',
    user: {},
  }

  handleLogin = (e) => {
    e.preventDefault()

    let params = {
      player: {
        username: e.currentTarget.username.value,
        password: e.currentTarget.password.value,
      },
    }

    this.setState({ error: '' })

    fetch(baseUrl + '/login', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          window.history.pushState({}, 'Players', '/players')
          localStorage.setItem('token', data.jwt)
          localStorage.setItem('admin', data.player.admin)

          this.setState({
            error: '',
            loggedIn: true,
            user: data.player,
          })
        } else {
          this.setState({ error: 'Invalid username or password' })
          alert('Invalid username or password')
        }
      })
  }

  handleLogout = () => {
    localStorage.clear()
    this.setState({ loggedIn: false })
  }

  fetchGroups = () => {
    this.setState({ loading: true, groups: [] })

    let token = localStorage.getItem('token')
    if (token) {
      fetch(baseUrl + '/groups', {
        headers: HEADERS,
      })
        .then((res) => res.json())
        .then((groups) => {
          console.log('App -> groups', groups)

          this.setState({ groups, loading: false })
        })
        .catch((e) => console.error(e))
    }
  }

  fetchPlayers = () => {
    this.setState({ loading: true, players: [] })

    let token = localStorage.getItem('token')
    if (token) {
      fetch(baseUrl + '/players', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((players) => {
          console.log('App -> players', players)
          const sortedPlayers = players.sort((a, b) => {
            if (a.ratings.length > 0 && b.ratings.length > 0) {
              return (
                b.ratings[b.ratings.length - 1].value -
                a.ratings[a.ratings.length - 1].value
              )
            } else {
              return 0
            }
          })
          this.setState({
            players: sortedPlayers,
            loading: false,
          })
        })
        .catch((e) => console.error(e))
    }
  }

  handleAddPlayerToGroup = (groupId, playerId, addOrRemove) => {
    this.setState({ loading: true })

    let data = {
      player_id: playerId,
      add_or_remove: addOrRemove,
    }

    fetch(`${baseUrl}/groups/${groupId}`, {
      method: 'PATCH',
      headers: HEADERS,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((jsonData) => {
        this.fetchPlayers()
        this.fetchGroups()
        this.setState({
          loading: false,
        })
      })
  }

  handleCreatePlayer = () => {}

  handleNavClick = () => {
    this.setState({ navigated: true })
  }

  componentDidMount() {
    this.fetchGroups()
    this.fetchPlayers()
  }

  render() {
    const { user, groups, players, loading } = this.state
    console.log('render -> groups', groups)
    return (
      <Container style={{ padding: '1rem' }}>
        {localStorage.getItem('token') ? (
          <div path="/">
            <Segment clearing>
              <Header as="h1" floated="left">
                WDCTT Ratings
              </Header>
              <Link to="/login" onClick={this.handleLogout}>
                <Button floated="right">Log Out</Button>
              </Link>
            </Segment>
            <Message>
              <Message.Header>
                Application status: very much under construction
              </Message.Header>
              <Message.List>
                <Message.Item>
                  Right now, it pretty much just displays players (and their
                  ratings), groups (and their players), and sessions.
                </Message.Item>
                <Message.Item>
                  I've just started on the main interface for recording results
                  and calculating ratings. It's in the "Record Results" tab.
                </Message.Item>
              </Message.List>
            </Message>
            <Menu tabular stackable>
              <Link
                to="/players"
                onClick={() => this.handleNavClick('players')}
              >
                <Menu.Item
                  name="players"
                  active={window.location.href.indexOf('players') > -1}
                />
              </Link>
              <Link to="/groups" onClick={() => this.handleNavClick('groups')}>
                <Menu.Item
                  name="groups"
                  active={window.location.href.indexOf('groups') > -1}
                />
              </Link>
              <Link
                to="/sessions"
                onClick={() => this.handleNavClick('sessions')}
              >
                <Menu.Item
                  name="sessions"
                  active={window.location.href.indexOf('sessions') > -1}
                />
              </Link>
              <Link
                to="/record-results"
                onClick={() => this.handleNavClick('record-results')}
              >
                <Menu.Item
                  name="record results"
                  icon="calculator"
                  active={window.location.href.indexOf('record-results') > -1}
                />
              </Link>
            </Menu>
          </div>
        ) : null}
        <Router>
          {localStorage.getItem('token') ? (
            <Segment path="/">
              <PlayerContainer
                path="/players"
                loading={loading}
                user={user}
                groups={groups}
                players={players}
                handleAddPlayerToGroup={this.handleAddPlayerToGroup}
                handleCreatePlayer={this.handleCreatePlayer}
              />
              <GroupContainer
                path="/groups"
                loading={loading}
                user={user}
                groups={groups}
                players={players}
                handleAddPlayerToGroup={this.handleAddPlayerToGroup}
              />
              <SessionContainer path="/sessions" user={user} />
              <CalculateRatings path="/record-results" user={user} />
            </Segment>
          ) : null}
          {!localStorage.getItem('token') ? (
            <LoginForm path="/login" handleLogin={this.handleLogin} />
          ) : null}
        </Router>
      </Container>
    )
  }
}
