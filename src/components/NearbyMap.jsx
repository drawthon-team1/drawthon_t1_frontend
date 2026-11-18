import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';

const CENTER = { lat: 36.8151, lng: 127.1138 };

const NearbyMap = () => {
  const [loading, error] = useKakaoLoader({
    appkey: 'f48fee4e29630bfaef611dcb277b9d4f',
  });

  if (loading) return <div>지도 가져오는 중...</div>;
  if (error) return <div>지도 로드 실패! 키값이나 도메인을 다시 확인하세요.</div>;

  return (
    <Map center={CENTER} style={{ width: '100%', height: '400px' }} level={3}>
      <MapMarker position={CENTER}>
        <div style={{ padding: '5px', color: '#000' }}>여기가 일터입니다!</div>
      </MapMarker>
    </Map>
  );
};

export default NearbyMap;
