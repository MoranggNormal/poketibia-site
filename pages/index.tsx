import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { signIn, getSession, signOut } from "next-auth/react";

type session = {
  session: {
    expires?: Date;
    user?: {
      name: string;
      email: string;
      image: string;
    };
  };
};

const Home: NextPage | any = ({ session }: session) => {
  const signInWithGoogle = async () => {
    await signIn();
  };

  return (
    <div>
      {session?.user == null ? (
        <button onClick={() => signIn("google")}>Entrar</button>
      ) : (
        <button onClick={() => signOut()}>Sair</button>
      )}

       <h4>Hello, {session?.user ? session.user.name : 'guest'}</h4>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      session: await getSession(context),
    },
  };
};
