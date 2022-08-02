import { useState, useEffect } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  height: 100vh;
  padding-inline: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  background-color: rgba(51, 65, 91, 0.96);
  color: white;
`

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`

const MintButton = styled.button`
  background-color: rgba(98, 121, 174, 0.46);
  color: #fff;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  cursor: pointer;
`

function App() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timezone, setTimezone] = useState('')
  const [location, setLocation] = useState('taipei')
  const [currentAccount, setCurrentAccount] = useState(null)

  const getLocalTime = async () => {
    const locationQuery = new URLSearchParams(window.location.search).get(
      'location'
    )

    // console.log('location: ', locationQuery)

    const res = await fetch(
      `https://timezone.abstractapi.com/v1/current_time/?api_key=fe70b53cf8d54ed4ac6b92eff7547006&location=${locationQuery}`
    )
    const data = await res.json()

    setTimezone(data.timezone_location)
    setLocation(data.timezone_location)

    // console.log('Timezone: ', data.timezone_location)
    // console.log('Datetime: ', data.datetime)
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        alert('Please connect to MetaMask first')
        return
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' })
      console.log('Connected account: ', accounts[0])

      if (accounts.length !== 0) {
        const account = accounts[0]
        setCurrentAccount(account)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleMint = () => {
    console.log('Click mint')
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  useEffect(() => {
    // getLocalTime()
  }, [])

  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000)

    return () => {
      clearInterval(timeInterval)
    }
  }, [])

  return (
    <Container>
      {currentAccount && (
        <ColumnContainer>
          <p>{currentAccount}</p>
          <MintButton onClick={handleMint}>Mint</MintButton>
        </ColumnContainer>
      )}
      {timezone && (
        <ColumnContainer>
          <h2>{location}</h2>
          <p>
            {currentTime.toLocaleString('en-US', {
              timeZone: timezone
            })}
          </p>
        </ColumnContainer>
      )}
    </Container>
  )
}

export default App
