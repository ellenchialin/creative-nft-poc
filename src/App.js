import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import styled from 'styled-components'

import CreativeNFTPOC from './utils/CreativeNFTPOC.json'
import { locations } from './utils/locationList'

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

const CONTRACT_ADDRESS = '0x4E974c3BC95F9e5637EF77BE165BE09c46C2e12f'

function App() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timezone, setTimezone] = useState('')
  const [location, setLocation] = useState('taipei')
  const [isLoading, setIsLoading] = useState(false)

  const getSeed = async (tokenId) => {
    try {
      const infuraProvider = new ethers.providers.JsonRpcProvider(
        'https://rinkeby.infura.io/v3/7d943fe8904d4be9b833a086c1f4a566'
      )
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CreativeNFTPOC.abi,
        infuraProvider
      )

      console.log('connectedContract: ', connectedContract)

      const seed = await connectedContract.getSeed(tokenId)
      return seed
    } catch (error) {
      console.log('Error: reading seed from contract', error)
    }
  }

  const getLocalTime = async (location) => {
    try {
      const res = await fetch(
        `https://timezone.abstractapi.com/v1/current_time/?api_key=fe70b53cf8d54ed4ac6b92eff7547006&location=${location}`
      )
      const data = await res.json()

      setTimezone(data.timezone_location)
      setLocation(data.timezone_location)

      console.log('Location Data: ', data)
    } catch (error) {
      console.log('Error: fetching data from abstractapi', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getLocation = async (tokenId) => {
    try {
      setIsLoading(true)
      const seed = await getSeed(tokenId)

      if (seed) {
        console.log('seed: ', seed)
        if (
          Number(seed) ===
          Number(
            0x0000000000000000000000000000000000000000000000000000000000000000
          )
        ) {
          alert('Token id does not exist. Please try another token id.')
          return
        }

        const parsed = parseInt(Number(seed), 10)
        console.log('parsed number from seed: ', parsed)

        const matchedLocation = locations.find(
          (location) => location.id === parsed
        ).location

        console.log(matchedLocation)
        getLocalTime(matchedLocation)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Check tokenId query and call getSeed(id)
  // Parse seed and match location
  // Send location request and show time
  useEffect(() => {
    const tokenIdQuery = new URLSearchParams(window.location.search).get(
      'tokenid'
    )

    if (tokenIdQuery) {
      console.log('tokenId Query: ', tokenIdQuery)
      getLocation(tokenIdQuery)
    }
  }, [])

  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000)

    return () => {
      clearInterval(timeInterval)
    }
  }, [])

  return (
    <Container>
      {timezone ? (
        <ColumnContainer>
          <h2>{location}</h2>
          <p>
            {currentTime.toLocaleString('en-US', {
              timeZone: timezone
            })}
          </p>
        </ColumnContainer>
      ) : (
        <p>
          {isLoading
            ? 'Getting city info...'
            : 'Seach Token ID on URL to get city info'}
        </p>
      )}
    </Container>
  )
}

export default App
