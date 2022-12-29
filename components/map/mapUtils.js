import {
  TYPE_ROADMAP,
  TYPE_HYBRID,
  MODE_MAP_VIEW,
  MODE_STREET_VIEW,
} from "~/utils/variables.js";

export const initMapOption = (id, mode, type, lat, long) => {
  if (mode == MODE_MAP_VIEW) {
    initMapMarker(id, type, lat, long);
  } else if (mode == MODE_STREET_VIEW) {
    initStreetMap(id, lat, long);
  }
}

export const initStreetMap = (id, lat, long) => {
  var roadviewContainer = document.getElementById(id); //로드뷰를 표시할 div
  var roadview = new kakao.maps.Roadview(roadviewContainer); //로드뷰 객체
  var roadviewClient = new kakao.maps.RoadviewClient(); //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체
  var position = new kakao.maps.LatLng(lat, long);
  // 특정 위치의 좌표와 가까운 로드뷰의 panoId를 추출하여 로드뷰를 띄운다.
  roadviewClient.getNearestPanoId(position, 50, function (panoId) {
    if (panoId) {
      roadview.setPanoId(panoId, position); //panoId와 중심좌표를 통해 로드뷰 실행
    }

    return roadviewClient;
  });
}

export const initMapMarker  = (id, type, lat, long) =>{
  var mapContainer = document.getElementById(id), // 지도를 표시할 div
    mapOption = {
      center: new kakao.maps.LatLng(lat, long), // 지도의 중심좌표
      level: 6, // 지도의 확대 레벨
    };
  var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
  if (type == TYPE_ROADMAP) {
    map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
  } else if (type == TYPE_HYBRID) {
    map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
  }
  var marker = new kakao.maps.Marker();
  marker.setPosition(map.getCenter());
  return marker.setMap(map);
}

export const initMultiMarker  = (id, places) => {
  var mapContainer = document.getElementById(id),
    mapOption = {
      center: new kakao.maps.LatLng(
        places[0].geopoint._lat,
        places[0].geopoint._long
      ), // 지도의 중심좌표
      level: 12, // 지도의 확대 레벨
    };

  var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

  for (let place of places) {
    let { _lat, _long } = place.geopoint;

    // 지도에 마커를 표시합니다
    var marker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(_lat, _long),
    });
    // 커스텀 오버레이에 표시할 컨텐츠 입니다
    // 커스텀 오버레이는 아래와 같이 사용자가 자유롭게 컨텐츠를 구성하고 이벤트를 제어할 수 있기 때문에
    // 별도의 이벤트 메소드를 제공하지 않습니다
    var content =
      '<div class="wrap">' +
      '    <div class="info">' +
      '        <div class="title text-truncate d-block">' +
      place.title +
      "</div>" +
      '        <div class="body">' +
      '            <div class="img">' +
      `               <img src="${place.thumbnailUrl}">` +
      "           </div>" +
      '            <div class="desc">' +
      '                <div class="ellipsis">' +
      place.cityName +
      " - " +
      place.categoryName +
      "</div>" +
      `                <div><a href="https://map.kakao.com/link/to/${place.title},${_lat},${_long}" target="_blank" class="link">Navigation</a></div>` +
      "            </div>" +
      "        </div>" +
      "    </div>" +
      "</div>";

    // 마커 위에 커스텀오버레이를 표시합니다
    // 마커를 중심으로 커스텀 오버레이를 표시하기위해 CSS를 이용해 위치를 설정했습니다
    console.log(content.length);
    var overlay = new kakao.maps.CustomOverlay({
      content: content,
      map: map,
      position: marker.getPosition(),
    });

    // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
    kakao.maps.event.addListener(marker, "click", function () {
      overlay.setMap(map);
    });
  }

  // 커스텀 오버레이를 닫기 위해 호출되는 함수입니다
}
