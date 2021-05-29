import React from "react"
import { ThemeButton } from "./theme-button"
import { TextField } from "@material-ui/core"
import i18n from "../i18n/ru.json"
import "../css/final.css"

interface IProps {
  onExit: () => void
}

interface IState {
  email: string
  emailValid: boolean
}

export default class Final extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { email: "", emailValid: true }
  }

  onSendClick() {
    console.log("email", this.state.email)
    setTimeout(() => this.props.onExit(), 1000)
  }

  validateEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  onInput(email: string) {
    this.setState({ email: email })
  }

  isInputError() {
    return this.state.email.length > 0 && !this.validateEmail(this.state.email)
  }

  getInputErrorText() {
    return this.isInputError() ? i18n["incorrect_email"] : ""
  }

  isButtonDisabled() {
    return !this.validateEmail(this.state.email)
  }

  render() {
    return (
      <>
        <p className="final-header">{i18n["final_header"]}</p>

        <p className="final-desc">{i18n["final_desc"]}</p>

        <div className="bot-container">
          <TextField
            className="final-input"
            helperText={this.getInputErrorText()}
            error={this.isInputError()}
            id="email"
            type="email"
            label="Email"
            size="small"
            variant="outlined"
            onChange={e => this.onInput(e.target.value)}
          />
          <ThemeButton
            className="final-btn"
            disabled={this.isButtonDisabled()}
            onClick={this.onSendClick.bind(this)}
          >
            {i18n["final_send_btn"]}
          </ThemeButton>
        </div>
      </>
    )
  }
}