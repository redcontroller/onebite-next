'use client';

import deleteReviewAction from '@/actions/delete-review.action';
import { useActionState, useEffect, useRef } from 'react';

export default function ReviewItemDeleteButton({
  reviewId,
  bookId,
}: {
  reviewId: number;
  bookId: number;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    deleteReviewAction, // 서버액션
    null // state 초기값
  );

  // 에러 핸들링
  useEffect(() => {
    if (state && !state.status) {
      alert(state.error);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction}>
      <input type="number" name="reviewId" value={reviewId} hidden readOnly />
      <input type="number" name="bookId" value={bookId} hidden readOnly />
      {isPending ? ( // 중복 제출 방지
        <div>...</div>
      ) : (
        <div onClick={() => formRef.current?.requestSubmit()}>삭제하기</div>
      )}
    </form>
  );
}
