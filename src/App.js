import { useState, useEffect } from 'react'
import { ethers, utils } from 'ethers'
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

const MintButton = styled.button`
  background-color: rgba(98, 121, 174, 0.46);
  color: #fff;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  cursor: pointer;
`

const CONTRACT = '0x4E974c3BC95F9e5637EF77BE165BE09c46C2e12f'

function App() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timezone, setTimezone] = useState('')
  const [location, setLocation] = useState('taipei')
  const [currentAccount, setCurrentAccount] = useState(null)

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        alert('Please connect to MetaMask first')
        return
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' })
      console.log('Connected wallet: ', accounts[0])

      if (accounts.length !== 0) {
        const account = accounts[0]
        setCurrentAccount(account)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleMint = async () => {
    console.log('Click mint')

    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(
          CONTRACT,
          CreativeNFTPOC.abi,
          signer
        )

        console.log('connectedContract: ', connectedContract)

        let nftTxn = await connectedContract.mint()

        await nftTxn
        console.log('nftTxn: ', nftTxn.hash)
      } else {
        alert('Please connect to wallet first and try again.')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getSeed = async (tokenId) => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(
          CONTRACT,
          CreativeNFTPOC.abi,
          signer
        )

        console.log('connectedContract: ', connectedContract)

        let seed = await connectedContract.getSeed(tokenId)

        return seed
      } else {
        alert('Please connect to wallet first and try again.')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getLocalTime = async (location) => {
    const res = await fetch(
      `https://timezone.abstractapi.com/v1/current_time/?api_key=fe70b53cf8d54ed4ac6b92eff7547006&location=${location}`
    )
    const data = await res.json()

    setTimezone(data.timezone_location)
    setLocation(data.timezone_location)

    console.log('Location Data: ', data)
  }

  const getLocation = async (tokenId) => {
    const seed = await getSeed(tokenId)
    const parsed = parseInt(Number(seed), 10)

    const matchedLocation = locations.find(
      (location) => location.id === parsed
    ).location

    console.log(matchedLocation)
    getLocalTime(matchedLocation)
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
    checkIfWalletIsConnected()
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
        <ColumnContainer>
          <MintButton onClick={handleMint}>Mint</MintButton>
        </ColumnContainer>
      )}
    </Container>
  )
}

export default App
