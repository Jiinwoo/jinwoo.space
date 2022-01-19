import React, { createRef, FunctionComponent, useEffect } from 'react'
import styled from "@emotion/styled"

const src = 'https://utteranc.es/client.js'
const repo = 'Jiinwoo/jinwoo.space' // 자신 계정의 레포지토리로 설정

type UtterancesAttributesType = {
  src: string
  repo: string
  'issue-term': string
  label: string
  theme: string
  crossorigin: string
  async: string
}

const CommentWidget: FunctionComponent = function () {
  const element = createRef<HTMLDivElement>()

  useEffect(() => {
    if (element.current === null) return

    const utterances: HTMLScriptElement = document.createElement('script')

    const attributes: UtterancesAttributesType = {
      src,
      repo,
      'issue-term': 'pathname',
      label: 'Comment',
      theme: `github-light`,
      crossorigin: 'anonymous',
      async: 'true',
    }
    Object.entries(attributes).forEach(([key, value]) => {
      utterances.setAttribute(key, value)
    })

    element.current.appendChild(utterances)
  }, [])

  return <UtteranceWrapper ref={element} />
}

const UtteranceWrapper = styled.div`
  @media (max-width: 768px) {
    padding: 0 20px;
  }
`

export default CommentWidget
