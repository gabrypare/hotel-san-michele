import roomsJson from '../content/rooms.json'

export const ROOMS_DATA = Object.fromEntries(
  roomsJson.rooms.map(room => [room.slug, room])
)

export const ROOM_SLUGS = roomsJson.rooms.map(r => r.slug)
