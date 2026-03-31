function About() {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[var(--background)] text-[var(--text)]">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-6 text-[var(--light-green)]">
          About Links Organizer
        </h1>
        <p className="text-lg mb-4 leading-relaxed">
          Links Organizer is a powerful tool designed to help you keep your
          links organized and easily accessible. Whether you're collecting
          YouTube videos, articles, tutorials, or any other web content, our app
          allows you to create custom folders and categorize your links
          efficiently.
        </p>
        <p className="text-lg mb-4 leading-relaxed">
          Organize all kinds of links into neatly structured folders, making it
          simple to find and manage your favorite content. With an intuitive
          interface, you can add, edit, and delete folders and links with ease.
        </p>
        <p className="text-lg leading-relaxed text-[var(--light-green)] font-semibold">
          Without creating an account, all your folders and links are stored
          locally in your browser, ensuring your data stays private and
          accessible only to you.
        </p>
      </div>
    </div>
  );
}

export default About;
