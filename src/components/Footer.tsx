import Link from 'next/link';
import { P } from './ui/typography';
import { FaGithub } from 'react-icons/fa';

export default function Footer() {
  // const {mode, setMode} = useContext(ColorModeContext);

  return (
    <div className="fixed bottom-0 left-0 z-20 p-4 flex justify-center w-full flex-row items-center *:px-2 divide-x-2">
      {/* TODO ADD BACK DARK MODE SELECTOR */}
      {/* <div className="flex flex-row items-center gap-1 divide-x-0 bottom-5 w-full"> */}
      {/* <IconButton
          onClick={() => {
            setMode(mode === 'dark' ? 'light' : 'dark');
          }}
        >
          {mode === 'dark' ? <NightsStayRounded /> : <LightModeRounded />}
        </IconButton> */}
      <P>Created by Jackson Romero</P>
      <Link
        href={'https://github.com/jacksontromero/finals-calculator'}
        target="_blank"
      >
        <FaGithub size={20} />
      </Link>
      {/* </div> */}
    </div>
  );
}
