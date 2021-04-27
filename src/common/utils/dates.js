import { DateTime } from "luxon";
import TimeAgo from "javascript-time-ago";
import ru from "javascript-time-ago/locale/ru";

TimeAgo.locale(ru);

export const now = () => {
  const date = new Date().toISOString();
  const dt = DateTime.fromISO(date);
  const f = dt.toFormat("dd.LL.yy, HH:mm:ss");
  const result = `[${f}]`;

  return result;
};

/**
 * Конверсия ISO-даты в mm.dd.yyyy, например:
 * Было     : 2018-08-27T20:05:12.572602Z
 * Стало    : 27.08.2018
 * withTime : 27.08.2018, 15:00
 * Т.е. выводит так же в московском времени.
 */
export const formatISOtoHuman = (date, withTime) => {
  const dt = DateTime.fromISO(date);
  const { day, month, year, hour, minute } = dt;
  const d = day.toString().padStart(2, "0");
  const m = month.toString().padStart(2, "0");
  const H = hour.toString().padStart(2, "0");
  const M = minute.toString().padStart(2, "0");
  let result = `${d}.${m}.${year}`;
  if (withTime) {
    result = `${result}, ${H}:${M}`;
  }

  return result;
};

export const formatISOtoHumanTimeOnly = date => {
  const dt = DateTime.fromISO(date);
  const { hour, minute } = dt;
  const H = hour.toString().padStart(2, "0");
  const M = minute.toString().padStart(2, "0");
  const result = `${H}:${M}`;

  return result;
};

/**
 * Форматирует utc-дату и выводит в московском времени.
 */
export const formatISOtoHumanWithTime = date => {
  const dt = DateTime.fromISO(date);
  const { day, month, year, hour, minute } = dt;
  const d = day.toString().padStart(2, "0");
  const m = month.toString().padStart(2, "0");
  const hh = hour.toString().padStart(2, "0");
  const mm = minute.toString().padStart(2, "0");
  const result = `${d}.${m}.${year} ${hh}:${mm}`;

  return result;
};

/**
 * Создание ISO-даты на основе текущего момента.
 * Часовой пояс создается UTC-шный, т.е. Z на конце.
 */
export const createISOnow = () => new Date().toISOString();

export const createLuxonNow = () => DateTime.utc();
export const formatLuxonToHuman = lValue => formatISOtoHuman(lValue.toISO());

/**
 * Сдвиг ISO-даты на указанное кол-во дней.
 * Промежуточная конверсия в Luxon DateTime и обратно.
 */
export const shiftISOdays = (date, days) => {
  const result = DateTime.fromISO(date)
    .toUTC()
    .plus({ days })
    .toISO();

  return result;
};

/**
 * Ставит время указанной даты на конец суток (23:59) по Московскому времени.
 * При этом сам DateTime остается указанным в utc-формате.
 */
export const endOfMoscowDay = date => {
  const hour = 20; // 23 по Московскому
  const minute = 59;
  const result = DateTime.fromISO(date)
    .toUTC()
    .set({ hour, minute })
    .toISO();

  return result;
};

/**
 * Конвертация ISO-даты в Luxon-объект, используемый в календаре-пикере даты.
 * Если на вход подали пустую строку, то вернем текущий момент.
 */
export const formatISOtoLuxon = date => {
  let result;
  if (date === "") {
    result = DateTime.utc();
  } else {
    result = DateTime.fromISO(date);
  }

  return result;
};

export const formatLuxonToISO = lValue => lValue.toUTC().toISO();
/**
 * Подразумевается что время введено в формате Москвы.
 */
export const formatHumanToLuxon = sValue => {
  const [day, month, year] = sValue
    .split(".")
    .map(token => parseInt(token, 10));
  const hour = 23;
  const minute = 59;
  const zone = "Europe/Moscow";

  const result = DateTime.fromObject({
    day,
    month,
    year,
    hour,
    minute,
    zone
  }).toUTC();

  return result;
};

export const formatLuxonToDate = lValue => lValue.toJSDate();

export const calcPrescription = dt => {
  const timeAgo = new TimeAgo("ru");
  const result = timeAgo.format(dt.toJSDate());

  return result;
};
