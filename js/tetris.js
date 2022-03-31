// js/tetris.js
'use strict'
import Blocks from './blocks.js'

export default class Tetris {    
    //생성자
    constructor() { 
        //setting
        this.N = 20
        this.M = 10
        this.downInterval = undefined

        //block
        this.blockInfo = undefined //현재 블록의 정보를 담음

        //dom
        this.stage = document.querySelector('.stage')

        //events
        document.addEventListener('keydown', (e) => {
            switch (e.keyCode) {
                case 39:
                    this.moveBlock('m', 1)
                    break
                case 37:
                    this.moveBlock('m', -1)
                    break
                case 40:
                    this.moveBlock('n', 1)
                    break
                case 38:
                    this.changeDirection()
                    break
                case 32:
                    this.dropBlock()
                    break
                default:
                    break
            }
        })
    }

    init() {
        this.makeGround()
        this.nextBlocks = []
        for (let i = 0; i < 4; i++) {
            this.makeNextBlock()
        }
        this.renderNextBlock()
        this.makeNewBlock()
    }
    
    makeNewBlock() {
        const next = this.nextBlocks.shift() //nextBlocks 배열의 맨 앞의 값 제거
        this.blockInfo = {
            type: next,
            direction: 0,
            n: 0,
            m: 3,
        }
        this.movingBlock = { ...this.blockInfo }
        this.makeNextBlock()
        this.renderNextBlock()
        this.renderBlock()
        this.checkNextBlock('start')
    }

    renderBlock() { //현재 block 나타내기
        const { type, direction, n, m } = this.movingBlock
        //이전의 위치의 모든 요소들의 클래스를 삭제
        const temp = document.querySelectorAll('.moving')
        temp.forEach((x) => {
            x.classList.remove(type, 'moving')
        })

        Blocks[type][direction].forEach((block) => {
            const x = block[0] + n //block을 구성하는 한 칸의 x좌표들에 초기위치 더해줌
            const y = block[1] + m //block을 구성하는 한 칸의 y좌표들에 초기위치 더해줌
            const target = this.stage.childNodes[x].childNodes[y]
            target.classList.add(type, 'moving')
        })
        this.blockInfo.n = n
        this.blockInfo.m = m
        this.blockInfo.direction = direction
    }

    renderNextBlock() { // next block 이미지 띄우기
        const next = document.querySelector('.next')
        let temp = []
        for (let i = 0; i < 4; i++) {
            temp.push(
                `<img class='tetris' src="./img/${this.nextBlocks[i]}.png" alt="${this.nextBlocks[i]}"/>`
            )
        }
        next.innerHTML = temp.join('')
    }

    makeNextBlock() { //랜덤으로 next block 생성
        const blockArray = Object.entries(Blocks) //object.entries() 메서드는 [key, value] 쌍을 반환.
        const randomIndex = Math.floor(Math.random() * blockArray.length) 
        this.nextBlocks.push(blockArray[randomIndex][0]) //blockArray[randomIndex][0]: Blocks의 랜덤 도형 중 0번째 모양(방향키 누르기 전 모양) 가져오기.
    }

    makeGround() { //게임판 생성
        this.ground = []
        for (let i = 0; i < this.N; i++) {
            this.ground.push('<tr>') //행 20개 생성
            for (let j = 0; j < this.M; j++) {
                this.ground.push('<td></td>') //각 행에 열 10개 생성
            }
            this.ground.push('</tr>')
        }
        this.stage.innerHTML = this.ground.join('') //.stage div 안에 ground[] 배열 삽입. 구분값: ''
    }

    moveBlock(where, amount) {
        this.movingBlock[where] += amount
        this.checkNextBlock(where)
    }

    changeDirection() {
        const direction = this.moveingBlock.direction
        direction === 3 ? (this.movingBlock.direction = 0) : (this.movingBlock.direction += 1)
        this.checkNextBlock(direction)
    }

    dropBlock() {
        clearInterval(this.downInterval)
        this.downInterval = setInterval(() => {
            this.moveBlock('n', 1)
        }, 8)
    }

    checkNextBlock(where=''){
        
    const { type, direction, n, m } = this.movingBlock
    let isFinished = false
    Blocks[type][direction].some((block) => {
      const x = block[0] + n
      const y = block[1] + m
      
      // changeDirection일 경우
      if (where === 0 || where === 1 || where === 2 || where === 3) {
        // moveAndTurn()
        // change Direction의 유효성 체크
      }
      // 그외 이동일 경우 : 좌우 밖이라면 기존의 bolockInfo으로 render
      else if (y < 0 || y >= this.M) {
        this.movingBlock = { ...this.blockInfo }
        this.renderBlock()
        return true
      }
      // 그외 이동일 경우 : 아래 범위 밖이라면 blockInfo상태를 finishBlock(블록 얼리기)
      else if (x >= this.N) {
        this.movingBlock = { ...this.blockInfo }
        isFinished = true
        this.finishBlock()
        return true
      }
      // 그외 이동일 경우 : 범위 안이라면
      else {
        const target = this.stage.childNodes[x]
          ? this.stage.childNodes[x].childNodes[y]
          : null
        // 아래로 이동일 경우
        if (where === 'm') {
          // 다음 블록이 가야할 자리가 finish클래스(먼저 정착한 블록이 있다면)을 가지고 있다면
          // 기존의 blockInfo로 movingBlock 업데이트
          if (target && target.classList.contains('finish')) {
            this.movingBlock = { ...this.blockInfo }
          }
        }
        // 그외 : 좌,우 이동 & 처음 시작했을 경우
        else {
          // 범위 내이지만 해당 위치에 블록이 이미 있을 경우
          if (target && target.classList.contains('finish')) {
            isFinished = true
            this.movingBlock = { ...this.blockInfo }
            // 만약 처음 렌더링 된 블록이라면 게임 종료
            if (where === 'start') {
              setTimeout(() => {
                //finishGame()
                console.log('게임종료')
              }, 0)
              return true
            }
            // 그외 : 블록 얼리기 (finishBlock)
            else {
              this.finishBlock()
              return true
            }
          }
        }
      }
    })
    // 블록을 구성하는 4가지 요소가 모두 유효하다면
    if ((where === 'n' || where === 'm') && !isFinished) {
      this.renderBlock()
    }
    }
}


