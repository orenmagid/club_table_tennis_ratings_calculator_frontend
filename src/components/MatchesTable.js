import React, { Component } from "react"
import { Table, Loader, Message } from "semantic-ui-react"
import CloseButton from "./elements/CloseButton"
import { baseUrl } from "../constants"
import { getFormattedDate } from "../utilities"

export default class MatchesTable extends Component {
  state = {
    sessionId: null,
    session: {},
    loading: true,
  }

  fetchSession = () => {
    const { sessionId } = this.props.match.params
    fetch(baseUrl + `/sessions/${sessionId}`, {})
      .then((res) => res.json())
      .then((session) => {
        console.log(
          "🚀 ~ file: MatchesTable.js ~ line 16 ~ MatchesTable ~ .then ~ session",
          session
        )
        this.setState({
          sessionId,
          session: session,
          loading: false,
        })
      })
      .catch((e) => console.error(e))
  }
  componentDidMount() {
    this.fetchSession()
  }

  componentDidUpdate() {
    const { sessionId: urlSessionId } = this.props.match.params
    const { sessionId: stateSessionId } = this.state

    if (urlSessionId !== stateSessionId) this.fetchSession()
  }

  render() {
    const { session, loading } = this.state
    const { matches } = session

    return (
      <>
        {!loading && matches.length > 0 ? (
          <>
            <CloseButton handleClick={() => window.history.back()} />
            <Message
              attached
              header={`Results for ${getFormattedDate(session.date, true)}`}
            />
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Winner</Table.HeaderCell>
                  <Table.HeaderCell>Loser</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {matches.map((match) => {
                  return (
                    <Table.Row key={match.id}>
                      <Table.Cell>
                        {
                          match.players.find(
                            (player) => player.id === match.winner_id
                          ).name
                        }
                      </Table.Cell>
                      <Table.Cell>
                        {
                          match.players.find(
                            (player) => player.id !== match.winner_id
                          ).name
                        }
                      </Table.Cell>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table>
          </>
        ) : (
          <Loader style={{ marginTop: "1rem" }} active inline="centered" />
        )}
      </>
    )
  }
}
