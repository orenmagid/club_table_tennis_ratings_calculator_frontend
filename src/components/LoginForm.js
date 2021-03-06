import React from "react"
import { Container, Form, Segment, Input, Button } from "semantic-ui-react"

export default function LoginForm({ handleLogin }) {
  return (
    <>
      <Container>
        <Form onSubmit={handleLogin}>
          <Segment stacked>
            <Form.Field>
              <Input
                icon="users"
                iconPosition="left"
                type="text"
                name="username"
                placeholder="Username"
              />
            </Form.Field>
            <Form.Field>
              <Input
                icon="lock"
                iconPosition="left"
                type="password"
                name="password"
                placeholder="Password"
              />
            </Form.Field>
            <Button>Login</Button>
          </Segment>

          <div className="ui error message" />
        </Form>
      </Container>
    </>
  )
}
