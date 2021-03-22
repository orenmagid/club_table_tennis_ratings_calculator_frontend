import React, { Component } from "react"
import { Link } from "react-router-dom"

import { Table, Message } from "semantic-ui-react"

export default class GroupListTable extends Component {
  render() {
    const { groups, handleGroupClick, activeItem } = this.props

    return (
      <>
        <Message
          attached
          header="Groups"
          content="Here's a list of groups for the current league. Click on a group to see a list of players in that group."
        />
        <Table selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Group Name</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {groups.map((group) => {
              return (
                <Table.Row active={group.id === activeItem} key={group.name}>
                  <Table.Cell>
                    <Link
                      to={`/groups/${group.id}`}
                      style={{ color: "inherit" }}
                      onClick={(e) => handleGroupClick(e, group.id)}
                    >
                      {group.name}
                    </Link>
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </>
    )
  }
}
