import style from './loading.module.css';

export default function Loading() {
  return (
    <div className={style.container}>
      <div>
        <h3>잠시만 기다려주세요 🙂</h3>
        <div className={style.spinner} />
      </div>
    </div>
  );
}
