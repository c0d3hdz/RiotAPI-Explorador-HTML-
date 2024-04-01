const apiKey = 'RGAPI-39121669-3362-4807-86cb-5e8a6323d0ff'
let puuidEncrip = ''

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

function displaySummonerData(summoner, region) {
    const summonerInfo = document.getElementById('summonerInfo')
    puuidEncrip = summoner.puuid
    summonerInfo.innerHTML = `
        <h2>${summoner.name}</h2>
        <p>Nivel: ${summoner.summonerLevel}</p>
        <p>Icono de Invocador:</p>
        <img src="http://ddragon.leagueoflegends.com/cdn/14.6.1/img/profileicon/${summoner.profileIconId}.png" alt="Icono de Invocador">
    `

    getChampionMasteries(region, puuidEncrip)
        .then(data => {
            // Procesar los datos y mostrarlos en la página
            const championMasteries = data
                .map(
                    champion => `
                <p>Champion: ${champion.championId}, Level: ${champion.championLevel}</p>
            `,
                )
                .join('')
            summonerInfo.innerHTML += `<div>${championMasteries}</div>`
        })
        .catch(error => {
            console.error('Error al obtener las maestrías de campeones:', error)
            summonerInfo.innerHTML += `<p>Error al obtener las maestrías de campeones.</p>`
        })
}

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
