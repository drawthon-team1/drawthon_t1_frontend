import { useEffect, useState } from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import { getMapNotices } from '../api/mapApi';

const CENTER = { lat: 36.45, lng: 127.8 };
const MAP_STYLE = { width: '100%', height: '400px' };

const fitSouthKorea = (map) => {
  const bounds = new window.kakao.maps.LatLngBounds(
    new window.kakao.maps.LatLng(34.25, 125.9),
    new window.kakao.maps.LatLng(38.65, 129.65),
  );
  map.setBounds(bounds);
};

const NearbyMap = () => {
  const [notices, setNotices] = useState([]);
  const [noticeError, setNoticeError] = useState(false);
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_JS_KEY,
  });

  useEffect(() => {
    let ignore = false;

    const fetchNotices = async () => {
      try {
        const data = await getMapNotices();
        if (!Array.isArray(data)) {
          throw new Error('지도 공고 응답이 배열이 아닙니다.');
        }
        if (!ignore) setNotices(data);
      } catch (fetchError) {
        if (!ignore) {
          console.error('지도 공고를 불러오지 못했습니다.', fetchError);
          setNoticeError(true);
        }
      }
    };

    fetchNotices();
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) return <div>지도 가져오는 중...</div>;
  if (error) return <div>지도 로드 실패! 키값이나 도메인을 다시 확인하세요.</div>;

  return (
    <>
      {noticeError && <p role="status">지도 공고를 불러오지 못했습니다.</p>}
      <Map center={CENTER} style={MAP_STYLE} onCreate={fitSouthKorea}>
        {notices.map((notice) => (
          <MapMarker
            key={notice.noticeId}
            position={{ lat: notice.latitude, lng: notice.longitude }}
            title={notice.title}
          />
        ))}
      </Map>
    </>
  );
};

export default NearbyMap;
