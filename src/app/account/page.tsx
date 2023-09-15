'use client';

import { getFirebaseAuth } from '@/lib/firebase';
import { useAuth } from '@/components/FirebaseAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { getAllQuestions, getExistingUser, patchQuestionAsDone } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Question, UserProfile } from '@/lib/types';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { CopyButton } from '@/components/CopyButton';

const auth = getFirebaseAuth();

const STATUS_MAP = {
  'Not started': 'Belum dijawab',
  Done: 'Sudah dijawab',
};

export default function Account() {
  const router = useRouter();
  const { toast } = useToast()
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [existingUser, setExistingUser] = useState<UserProfile | null>(null);
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
        setExistingUser(res.data)
      }
    }
  }

  const handleClickQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setIsOpenDialog(true);
  };

  const markAsDone = async (question: Question) => {
    if (user) {
      try {
        await patchQuestionAsDone(question.uuid, user)

        toast({
          title: 'Berhasil menandai pertanyaan',
          description: `Berhasil menandai pertanyaan sebagai sudah dijawab!`
        });

        setIsOpenDialog(false);
        fetchQuestionsFromDb();
      } catch (error) {

        toast({
          title: 'Gagal menyimpan perubahan',
          description: `Gagal saat mencoba menandai pertanyaan sebagai sudah dijawab, coba sesaat lagi!`
        });
      }
    }
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
          {questions && questions.length > 0 ? (
            <>
              <h3 className="text-xl font-bold tracking-tight">Ada {questions.length} pertanyaan belum dijawab</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {questions.map((q: Question) => (
                  <Card
                    key={q.uuid}
                    className="relative min-h-[200px] flex flex-col items-center justify-center p-4 cursor-pointer"
                    onClick={() => {
                      handleClickQuestion(q);
                    }}
                  >
                    <div className="absolute right-1 top-1">
                      <Badge variant={q.status === 'Done' ? 'default' : 'secondary'}>
                        {STATUS_MAP[q.status] || ''}
                      </Badge>
                    </div>

                    <p className="p-4 text-lg">{q.question}</p>
                  </Card>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </main>

      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mari jawab pertanyaan ini</DialogTitle>
            <DialogDescription>
              <div className="my-4">
                <p>{selectedQuestion?.question}</p>
                <div className="mt-20 flex flex-col gap-2">
                  <div className='flex gap-2'>
                    <Button
                      onClick={() => {
                        if (selectedQuestion) {
                          markAsDone(selectedQuestion);
                        }
                      }}
                    >
                      Tandai sudah dijawab
                    </Button>
                    <CopyButton text={`${process.env.NEXT_PUBLIC_BASE_URL}/p/${existingUser?.slug}/${selectedQuestion?.uuid}`}/>
                  </div>

                  <small>
                    Pertanyaan akan hilang dari daftar saat sudah dijawab
                  </small>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
