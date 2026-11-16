import assert from 'node:assert/strict';
import test from 'node:test';
import { filterPosts } from './postListFilters.js';

const posts = [
  {
    id: 'one',
    category: '유급',
    title: '벼 수확',
    farm: '하늘 농장',
    region: { city: '아산시', district: '배방읍' },
    schedule: { startDate: '2026-11-18', endDate: '2026-11-20' },
    duration: '3일 이하',
    timeSlot: ['오전', '오후'],
    status: '모집 중',
    taskType: '수확',
  },
  {
    id: 'two',
    category: '일자리',
    title: '상자 정리',
    farm: '푸른 농장',
    region: { city: '천안시', district: '성환읍' },
    schedule: { startDate: '2026-11-21', endDate: '2026-11-21' },
    duration: '하루',
    timeSlot: ['저녁'],
    status: '모집 완료',
    taskType: '선별·포장',
  },
  { id: 'three', category: '봉사', title: '잡초 제거 (햇살 농장)' },
];
const filters = {
  activeTab: '전체',
  searchKeyword: '',
  region: { city: '', district: '' },
  schedule: { startDate: '', endDate: '' },
  duration: [],
  timeSlot: [],
  status: [],
  taskType: [],
};
const ids = (changes) => filterPosts(posts, { ...filters, ...changes }).map((post) => post.id);

test('탭과 검색어를 함께 적용합니다', () => {
  assert.deepEqual(ids({}), ['one', 'two', 'three']);
  assert.deepEqual(ids({ activeTab: '유급' }), ['one', 'two']);
  assert.deepEqual(ids({ activeTab: '봉사', searchKeyword: ' 햇살 ' }), ['three']);
  assert.deepEqual(ids({ activeTab: '유급', searchKeyword: '하늘' }), ['one']);
});

test('여러 조건은 AND, 같은 항목의 선택지는 OR로 적용합니다', () => {
  assert.deepEqual(ids({
    region: { city: '아산시', district: '배방읍' },
    schedule: { startDate: '2026-11-20', endDate: '2026-11-21' },
    duration: ['하루', '3일 이하'],
    timeSlot: ['오후', '저녁'],
    status: ['모집 중'],
    taskType: ['수확', '제초'],
  }), ['one']);
  assert.deepEqual(ids({ region: { city: '아산시', district: '성환읍' } }), []);
  assert.deepEqual(ids({ schedule: { startDate: '2026-11-22', endDate: '' } }), []);
  assert.deepEqual(ids({ schedule: { startDate: '', endDate: '2026-11-18' } }), ['one']);
});

test('필터 데이터가 없는 공고는 해당 조건을 선택했을 때 제외합니다', () => {
  assert.deepEqual(ids({ duration: ['하루'] }), ['two']);
  assert.deepEqual(ids({ timeSlot: ['오전'] }), ['one']);
  assert.deepEqual(ids({ status: ['모집 완료'] }), ['two']);
  assert.deepEqual(ids({ taskType: ['제초'] }), []);
});
