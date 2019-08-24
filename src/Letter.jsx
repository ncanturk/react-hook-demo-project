import React from 'react'

export default (props) => {
  return (
    <div> 
      <div className="hexagon-sm hexagon-success shadow-sm text-white mr-3">
        {props.status && <span>{props.value}</span>}
      </div>
    </div>
  )
}
