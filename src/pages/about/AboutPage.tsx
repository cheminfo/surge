import type { ReactElement } from 'react';
import { AboutPage } from 'react-cheminfo/ui';

import { ABOUT } from '../../about.ts';

/**
 * The About page: the shared record every site of the family shows.
 * @returns The page.
 */
export default function About(): ReactElement {
  return <AboutPage content={ABOUT} />;
}
