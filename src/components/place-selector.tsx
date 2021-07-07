import React from "react"
import { Tags } from "./app"
import { PlaceData } from "./app"
import i18n from "../i18n/ru.json"
import "../css/place-selector.css"
import PlaceCard from "./place-card"
import Timeline from "./timeline"
import ym from "react-yandex-metrika"

type PlaceState = {
  checked: boolean
  label: string
  score: number
  placeData: PlaceData
}

interface IProps {
  onUpdate?: (selPlaces: string[]) => void
  onExit?: () => void
  debug?: boolean
  selTags: Tags
  places: PlaceData[]
  selPlaces: string[]
}

interface IState {
  cards: PlaceState[]
  infoIndex: number
}

export default class PlaceSelector extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    var dict: { [id: string]: number } = {}

    this.props.places.forEach(place => {
      const pMatch = place.tags.places.filter(tag =>
        this.props.selTags.places.includes(tag)
      ).length
      const tMatch = place.tags.themes.filter(tag =>
        this.props.selTags.themes.includes(tag)
      ).length
      dict[place.name] =
        3 * pMatch +
        2 * tMatch +
        (place.gmRating + place.taRating) / 5 +
        Math.log10(place.gmReviewsCnt + place.taReviewsCnt + 1) / 2
    })

    const sorted = this.props.places.sort((a: PlaceData, b: PlaceData) => {
      return dict[b.name] - dict[a.name]
    })

    const cards: PlaceState[] = sorted.map(
      place =>
        ({
          checked: this.props.selPlaces.includes(place.id),
          label: place.name,
          score: dict[place.name],
          placeData: place,
        } as PlaceState)
    )

    this.state = { cards: cards, infoIndex: -1 }
  }

  onCardClick(index: number, checked: boolean, e: any) {
    const { cards } = this.state
    cards[index].checked = checked
    this.setState({ cards: cards })
    if (this.props.onUpdate !== undefined) {
      this.props.onUpdate(
        cards.filter(card => card.checked).map(card => card.placeData.id)
      )
    }
  }

  onReset() {
    const { cards } = this.state
    cards.forEach(el => (el.checked = false))
    this.setState({ cards: cards })
    if (this.props.onUpdate !== undefined) {
      this.props.onUpdate([])
    }
  }

  onClickInfo(index: number, e: any) {
    e.stopPropagation()
    if (index == this.state.infoIndex) {
      index = -1
    } else {
      ym("reachGoal", "place-info")
    }
    this.setState({ infoIndex: index })
  }

  renderCards() {
    return this.state.cards.map((card, index) => (
      <PlaceCard
        key={index}
        checked={card.checked}
        debug={this.props.debug}
        label={card.label}
        score={card.score}
        placeData={card.placeData}
        showInfo={index == this.state.infoIndex}
        onInfoClick={this.onClickInfo.bind(this, index)}
        onClick={this.onCardClick.bind(this, index)}
      />
    ))
  }

  getConsumedTime() {
    var time = 0
    this.state.cards
      .filter(card => card.checked)
      .forEach(it => (time += it.placeData.ttv))
    return time
  }

  isTimelineHidden() {
    return this.getConsumedTime.call(this) == 0
  }

  render() {
    return (
      <>
        <h3 className="places-header">{i18n["select_places"]}</h3>
        <div
          style={{
            marginBottom: `${
              this.isTimelineHidden.call(this) ? "inherit" : "max(10vh, 100px)"
            }`,
          }}
          className="cards-container"
        >
          {this.renderCards.call(this)}
        </div>
        <Timeline
          hidden={this.isTimelineHidden.call(this)}
          time={this.getConsumedTime.call(this)}
          dayTime={600}
          onExit={this.props.onExit}
          onReset={this.onReset.bind(this)}
        />
      </>
    )
  }
}
