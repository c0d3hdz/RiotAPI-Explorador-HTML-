const apiKey = 'RGAPI-bb3a1d7d-e5ee-4fe8-b378-30c7b2a05f07' // API_KEY

async function searchSummoner() {
    const region = document.getElementById('region').value
    const summonerName = document.getElementById('summonerNameInput').value.trim()
    if (summonerName === '') {
        alert('Por favor ingresa un nombre de invocador.')
        return
    }

    try {
        const summoner = await getSummonerData(region, summonerName)
        displaySummonerData(summoner, region)
    } catch (error) {
        console.error('Error al obtener datos del invocador:', error)
        alert(
            'Error al obtener datos del invocador. Por favor revisa el nombre ingresado y asegúrate de que sea correcto.',
        )
    }
}

async function getSummonerData(region, summonerName) {
    const response = await fetch(
        `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${apiKey}`,
    )
    const data = await response.json()
    return data
}

async function getChampionMasteries(region, puuidEncrip) {
    const response = await fetch(
        `https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuidEncrip}/top?count=3&api_key=${apiKey}`,
    )
    const data = await response.json()
    return data
}

async function getChampionData() {
    const response = await fetch('http://ddragon.leagueoflegends.com/cdn/14.6.1/data/en_US/champion.json')
    const data = await response.json()
    return data.data
}

async function displayChampionMasteries(region, puuidEncrip) {
    const summonerInfo = document.getElementById('summonerInfo')
    try {
        const response = await fetch(
            `https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuidEncrip}/top?count=3&api_key=${apiKey}`,
        )
        const championMasteries = await response.json()
        const championData = await getChampionData()

        championMasteries.forEach(championMastery => {
            const championId = championMastery.championId
            const championName = Object.keys(championData).find(key => championData[key].key == championId)
            const championImageUrl = `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championName}_0.jpg`

            const championContainer = document.createElement('div')
            championContainer.classList.add('champion-container')

            const championImage = document.createElement('img')
            championImage.src = championImageUrl
            championImage.alt = championName
            championImage.classList.add('champion-image')

            const championNameElement = document.createElement('p')
            championNameElement.textContent = championName
            championNameElement.classList.add('champion-name')

            championContainer.appendChild(championImage)
            championContainer.appendChild(championNameElement)

            summonerInfo.appendChild(championContainer)
        })
    } catch (error) {
        console.error('Error al obtener las maestrías de campeones:', error)
        summonerInfo.innerHTML += `<p>Error al obtener las maestrías de campeones.</p>`
    }
}

function displaySummonerData(summoner, region) {
    const summonerInfo = document.getElementById('summonerInfo')
    let puuidEncrip = summoner.puuid
    summonerInfo.innerHTML = ''

    const summonerName = document.createElement('h2')
    summonerName.textContent = summoner.name
    summonerInfo.appendChild(summonerName)

    const summonerIcon = document.createElement('img')
    summonerIcon.src = `http://ddragon.leagueoflegends.com/cdn/14.6.1/img/profileicon/${summoner.profileIconId}.png`
    summonerIcon.alt = 'Icono de Invocador'
    summonerInfo.appendChild(summonerIcon)

    const summonerLevel = document.createElement('p')
    summonerLevel.textContent = `Nivel: ${summoner.summonerLevel}`
    summonerInfo.appendChild(summonerLevel)

    displayChampionMasteries(region, puuidEncrip)
}
