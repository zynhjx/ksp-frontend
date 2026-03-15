import styles from './DashboardLayout.module.css';
import { useMemo } from 'react';

const joinClasses = (...classes) => classes.filter(Boolean).join(' ');

const GREETING_TEMPLATES = [
  'Great to see you, {name}!',
  'Welcome back, {name}!',
  'Hello, {name}!',
  'Good to have you here, {name}.',
  'Glad you’re back, {name}!',
  'Ready for today’s updates, {name}?',
  'Let’s get things done, {name}.',
  'Here’s your dashboard, {name}.',
  'You’re all set, {name}.',
  'Nice to see you again, {name}.',
  'Welcome in, {name}.',
  'Your workspace is ready, {name}.',
  'Let’s keep the momentum going, {name}.',
  'Hope your day is going well, {name}.',
  'Everything looks ready, {name}.',
  'You’re in good shape today, {name}.',
  'Another great day ahead, {name}.',
  'All systems ready, {name}.',
  'Your latest insights are waiting, {name}.',
  'Time to make progress, {name}.',
  'Good day, {name}!',
  'Let’s move things forward, {name}.',
  'Dashboard refreshed for you, {name}.',
  'You’ve got this, {name}.',
  'Start strong today, {name}.',
  'Great day to do your best, {name}.',
  'Ready when you are, {name}.',
  'Let’s dive in, {name}.',
  'Your updates are here, {name}.',
  'Let’s make an impact today, {name}.',
  'You’re doing great, {name}.',
  'Welcome back to your dashboard, {name}.',
  'Data is up-to-date, {name}.',
  'A fresh start, {name}.',
  'Keep up the great work, {name}.',
  'Today looks promising, {name}.',
  'Focused and ready, {name}.',
  'Your dashboard, your pace, {name}.',
  'Nice momentum today, {name}.',
  'Wishing you a productive session, {name}.',
  'Let’s make steady progress, {name}.',
  'You’re ready to go, {name}.',
  'Good to see you online, {name}.',
  'Your day starts here, {name}.',
  'Let’s keep things moving, {name}.',
  'A strong start for today, {name}.',
  'Thanks for being here, {name}.',
  'Everything is set for you, {name}.',
];

const getGreetingText = (userFirstName) => {
  if (!userFirstName) return null;

  const fallback = `Hello, ${userFirstName}!`;
  const storageKey = `ksp.greeting.last.${String(userFirstName).toLowerCase()}`;
  let lastTemplate = null;

  try {
    lastTemplate = window.localStorage.getItem(storageKey);
  } catch {
    lastTemplate = null;
  }

  const candidatePool =
    GREETING_TEMPLATES.length > 1
      ? GREETING_TEMPLATES.filter((template) => template !== lastTemplate)
      : GREETING_TEMPLATES;

  const selectedTemplate = candidatePool[Math.floor(Math.random() * candidatePool.length)] || fallback;

  try {
    window.localStorage.setItem(storageKey, selectedTemplate);
  } catch (error) {
    void error;
  }

  return selectedTemplate.replace('{name}', userFirstName);
};

function DashboardLayout({
  eyebrow,
  title,
  userFirstName,
  greetingAsTitle = false,
  actions,
  stats,
  children,
  centered = false,
  pageClassName,
  headerClassName,
  eyebrowClassName,
  titleClassName,
  greetingClassName,
  statsClassName,
  contentClassName,
}) {
  const greetingText = useMemo(() => getGreetingText(userFirstName), [userFirstName]);

  return (
    <div className={joinClasses(styles.page, pageClassName)}>
      <header className={joinClasses(styles.header, centered && styles.centered, headerClassName)}>
        <div className={styles.headerContent}>
          {eyebrow ? <p className={joinClasses(styles.eyebrow, eyebrowClassName)}>{eyebrow}</p> : null}
          {greetingAsTitle && greetingText ? (
            <h1 className={joinClasses(styles.title, titleClassName, greetingClassName)}>{greetingText}</h1>
          ) : null}
          {!greetingAsTitle && title ? <h1 className={joinClasses(styles.title, titleClassName)}>{title}</h1> : null}
          {!greetingAsTitle && greetingText ? (
            <h2 className={joinClasses(styles.greeting, greetingClassName)}>{greetingText}</h2>
          ) : null}
        </div>

        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </header>

      {stats ? <section className={joinClasses(styles.statsSection, statsClassName)}>{stats}</section> : null}

      {children ? (
        <section className={joinClasses(styles.contentSection, contentClassName)}>{children}</section>
      ) : null}
    </div>
  );
}

export default DashboardLayout;
