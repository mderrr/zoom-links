import checkSchedule from './checkSchedule.js'
import { mainMessage } from './SHAlerts.js'

const dataLink = "https://raw.githubusercontent.com/shernandezz/zoom-links/master/JSON%20files/data.json"

mainMessage(function() {
    fetch(dataLink).then(response => response.json()).then(data => {
        checkSchedule(data)  
    })
})