export const addMarker = (map, topics = []) => {
   for(let topic of topics){
      var markerPosition  = new kakao.maps.LatLng(topic.latitude, topic.longitude);
      var marker = new kakao.maps.Marker({
         position: markerPosition
      });
      marker.setMap(map)
   }
}

export const querySearch = (data, status, pagination) => {
   if (status === kakao.maps.services.Status.OK) {
      return data.reduce((prev, curr) => {
        console.log({prev,curr})
        let existAddress = prev.some(res => res.address_name === curr.address_name)
        if (!existAddress) {
            prev.push(curr)
        }
        return prev
      }, [])
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert('검색 결과가 존재하지 않습니다.')
      return
    } else if (status === kakao.maps.services.Status.ERROR) {
      alert('검색 결과 중 오류가 발생했습니다.')
      return
    }
}