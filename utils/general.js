import moment from 'moment'


export const timeAgo = (date) => {
   return moment(new Date(date.seconds * 1000))
        .locale('fr')
        .fromNow()
}