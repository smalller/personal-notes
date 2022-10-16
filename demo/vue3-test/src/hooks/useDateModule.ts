import { ref } from "vue";

const nowTime = ref("00:00:00");
const getNowTime = (): void => {
  const newDate = new Date();
  const nowHours =
    newDate.getHours() < 10 ? "0" + newDate.getHours() : newDate.getHours();
  const nowMins =
    newDate.getMinutes() < 10
      ? "0" + newDate.getMinutes()
      : newDate.getMinutes();
  const nowsecs =
    newDate.getSeconds() < 10
      ? "0" + newDate.getSeconds()
      : newDate.getSeconds();
  nowTime.value = `${nowHours}:${nowMins}:${nowsecs}`;
};

let timer = undefined;
if (timer) {
  clearInterval(timer);
}
timer = setInterval(getNowTime, 1000);

export { nowTime, getNowTime };
