import { useState, useEffect } from 'react'

import './app.css'

function App() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timezone, setTimezone] = useState('')
  const [location, setLocation] = useState('')

  const getLocalTime = async () => {
    const locationQuery = new URLSearchParams(window.location.search).get(
      'location'
    )

    console.log('location: ', locationQuery)

    const res = await fetch(
      `https://timezone.abstractapi.com/v1/current_time/?api_key=fe70b53cf8d54ed4ac6b92eff7547006&location=${locationQuery}`
    )
    const data = await res.json()

    setTimezone(data.timezone_location)
    setLocation(data.timezone_location)

    console.log('Timezone: ', data.timezone_location)
    console.log('Datetime: ', data.datetime)
  }

  useEffect(() => {
    getLocalTime()
  }, [])

  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000)

    return () => {
      clearInterval(timeInterval)
    }
  }, [])

  return (
    <div className='container'>
      {timezone && (
        <div className='time-container'>
          <h2>{location}</h2>
          <p className='time'>
            {currentTime.toLocaleString('en-US', {
              timeZone: timezone
            })}
          </p>
        </div>
      )}
    </div>
  )
}

export default App
