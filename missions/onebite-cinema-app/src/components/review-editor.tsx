import createReviewAction from '@/actions/create-review.action';
import style from './review-editor.module.css';

export default function ReviewEditor({ movieId }: { movieId: string }) {
  return (
    <section>
      <form className={style.form_container} action={createReviewAction}>
        <input hidden readOnly type="text" name="movieId" value={movieId} />
        <textarea required name="content" placeholder="리뷰 내용" />
        <div className={style.bottom_container}>
          <input required type="text" name="author" placeholder="작성자" />
          <button type="submit">등록</button>
        </div>
      </form>
    </section>
  );
}
