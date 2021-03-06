import { CHESS_COLOR, RED_PLAY_STEP } from './map'

export default class PlayRecord {
  constructor(from, to, chess, chessboard) {
    this.from = from
    this.to = to
    this.chess = chess
    this.chessboard = chessboard

    const [x1, y1] = from.split(',').map(Number)
    const [x2, y2] = to.split(',').map(Number)

    this.startX = x1
    this.startY = y1
    this.endX = x2
    this.endY = y2
  }
  get color() {
    return this.chess.color
  }
  /**
   * 棋子斜走：馬，相，士
   */
  get isOblique() {
    return this.startX !== this.endX && this.startY !== this.endY
  }

  get playDirection() {
    if (this.startX === this.startY) {
      return '平'
    } else {
      if (
        (this.color === CHESS_COLOR.RED && this.endX < this.endY) ||
        (this.color === CHESS_COLOR.BLACK && this.endX > this.endY)
      ) {
        return '进'
      } else {
        return '退'
      }
    }
  }
  get playStep() {
    if (this.playDirection === '平' || this.isOblique) {
      return this.getReadStep(this.endY)
    } else {
      const diffStep = Math.abs(this.endY - this.startY)

      return this.color === CHESS_COLOR.RED ? RED_PLAY_STEP[diffStep] : diffStep
    }
  }

  getReadStep(y) {
    if (this.color === CHESS_COLOR.RED) {
      return RED_PLAY_STEP[9 - y]
    } else {
      return RED_PLAY_STEP[y + 1]
    }
  }

  /**
   * 获取当前棋盘中棋子所在列的所有同类型的棋子
   */
  getSameChesses() {
    return this.chessboard
      .getChessForColumn(this.startY)
      .filter(
        (chess) => chess.type === this.chess.type && chess.color === this.color
      )
  }

  getPlayRecord() {
    const result = Array(4)

    result[2] = this.playDirection
    result[3] = this.playStep

    const sameChesses = this.getSameChesses()

    if (sameChesses.length === 2) {
      const bigPositionChess =
        sameChesses[0].point[1] > sameChesses[1].point[1]
          ? sameChesses[0]
          : sameChesses[1]

      if (this.startY === bigPositionChess.point[1]) {
        result[0] = CHESS_COLOR.RED ? '前' : '后'
      } else {
        result[0] = CHESS_COLOR.RED ? '后' : '前'
      }

      result[1] = this.chess.name
    } else {
      result[0] = this.chess.name
      result[1] = this.getReadStep(this.startY)
    }

    return result.join('')
  }
}
