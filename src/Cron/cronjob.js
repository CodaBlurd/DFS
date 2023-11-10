
const moment = require('moment')
const {Service} = require('../models/service')


const CronJob = require('cron').CronJob

const task = new CronJob('* * * * * *', async ()=>{

  const services = await Service.find({ expiresAt: { $lte: moment() } })

  if( services.length !== -1){ 
    for ( let service of services ) {
      service.biddingStatus = 'closed'
      await service.save()
    }

  }

})

task.start()


// Task.start()