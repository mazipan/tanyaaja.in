'use client';

import { getFirebaseAuth } from '@/lib/firebase';
import { useAuth } from '@/components/FirebaseAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { getAllQuestions, getExistingUser } from '@/lib/api';
import { Question, UserProfile } from '@/lib/types';

import { EnvelopeClosedIcon, EnvelopeOpenIcon } from '@radix-ui/react-icons';
import { StatisticPanel } from '@/modules/AccountSettings/StatisticPanel';
import { QuestionPanel } from '@/modules/AccountSettings/QuestionCard';
import { QuestionDialog } from '@/modules/AccountSettings/QuestionDialog';

const auth = getFirebaseAuth();

export default function Account() {
  const router = useRouter();
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [owner, setOwner] = useState<UserProfile | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const { isLogin, isLoading, user } = useAuth(auth);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchQuestionsFromDb = async () => {
    if (user) {
      const res = await getAllQuestions(user);

      if (res && res.data) {
        setQuestions(res.data || []);
      }
    }
  };

  const fetchUserFromDb = async () => {
    if (user) {
      const res = await getExistingUser(user)

      if (res && res.data) {
        setOwner(res.data)
      }
    }
  }

  const handleClickQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setIsOpenDialog(true);
  };

  // Redirect back to /login --> if the session is not found
  useEffect(() => {
    if (!isLoading) {
      if (!isLogin) {
        router.push('/login');
      } else {
        fetchQuestionsFromDb();
        fetchUserFromDb();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin, isLoading, router]);

  return (
    <>
      <main className="w-full container py-8">
        <div className="w-full space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Daftar Pertanyaan Masuk
          </h2>
          <p className="text-muted-foreground">
            Lihat semua daftar pertanyaan yang masuk ke akun Anda
          </p>
        </div>

        <Separator className="my-6" />

        <div className="w-full flex flex-col gap-4">

          <StatisticPanel owner={owner} />

          {questions && questions.length > 0 ? (
            <>
              <h3 className="text-2xl font-bold tracking-tight flex gp-2 items-center">
                {questions.length} pertanyaan belum dijawab
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {questions.map((q: Question, index) => (
                  <QuestionPanel
                    key={q.uuid}
                    owner={owner}
                    question={q}
                    onClick={handleClickQuestion}
                    index={index + 1}/>
                ))}
              </div>
            </>
          ) : (
            <h3 className="text-xl font-bold tracking-tight flex gp-2 items-center">
              <EnvelopeOpenIcon className='mr-2 w-6 h-6' /> Tidak ada satupun pertanyaan yang belum dijawab
            </h3>
          )}
        </div>
      </main>

      <QuestionDialog
        isOpen={isOpenDialog}
        onOpenChange={setIsOpenDialog}
        user={user}
        owner={owner}
        onRefetch={fetchQuestionsFromDb}
        question={selectedQuestion}
      />
    </>
  );
}
