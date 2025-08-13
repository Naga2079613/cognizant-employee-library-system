 Script to generate 200 books for the library system
const fs = require('fs');
const path = require('path');

// Read existing books
const booksPath = path.join(__dirname, 'src', 'data', 'books.json');
const existingBooks = JSON.parse(fs.readFileSync(booksPath, 'utf8'));

// Categories for generating diverse books
const categories = ['Programming', 'Science', 'History', 'Philosophy', 'Psychology', 'Business', 'Fiction', 'Biography', 'Self-Help', 'Technology'];
const publishers = ['Penguin Random House', 'HarperCollins', 'Macmillan', 'Simon & Schuster', 'Hachette', 'Pearson', 'O\'Reilly Media', 'Addison-Wesley', 'MIT Press', 'Oxford University Press'];

// Sample book titles and authors for different categories
const bookTemplates = {
  Programming: [
    { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford' },
    { title: 'Python Crash Course', author: 'Eric Matthes' },
    { title: 'Effective Java', author: 'Joshua Bloch' },
    { title: 'The C++ Programming Language', author: 'Bjarne Stroustrup' },
    { title: 'Head First Design Patterns', author: 'Eric Freeman' },
    { title: 'Code Complete', author: 'Steve McConnell' },
    { title: 'Refactoring', author: 'Martin Fowler' },
    { title: 'The Art of Computer Programming', author: 'Donald Knuth' },
    { title: 'Structure and Interpretation of Computer Programs', author: 'Harold Abelson' },
    { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen' }
  ],
  Science: [
    { title: 'A Brief History of Time', author: 'Stephen Hawking' },
    { title: 'The Elegant Universe', author: 'Brian Greene' },
    { title: 'Cosmos', author: 'Carl Sagan' },
    { title: 'The Origin of Species', author: 'Charles Darwin' },
    { title: 'Silent Spring', author: 'Rachel Carson' },
    { title: 'The Double Helix', author: 'James Watson' },
    { title: 'Astrophysics for People in a Hurry', author: 'Neil deGrasse Tyson' },
    { title: 'The Feynman Lectures on Physics', author: 'Richard Feynman' },
    { title: 'What If?', author: 'Randall Munroe' },
    { title: 'The Gene', author: 'Siddhartha Mukherjee' }
  ],
  History: [
    { title: 'Sapiens', author: 'Yuval Noah Harari' },
    { title: 'The Guns of August', author: 'Barbara Tuchman' },
    { title: 'A People\'s History of the United States', author: 'Howard Zinn' },
    { title: 'The Silk Roads', author: 'Peter Frankopan' },
    { title: 'The Wright Brothers', author: 'David McCullough' },
    { title: 'The Immortal Life of Henrietta Lacks', author: 'Rebecca Skloot' },
    { title: '1776', author: 'David McCullough' },
    { title: 'The Diary of a Young Girl', author: 'Anne Frank' },
    { title: 'The History of the Decline and Fall of the Roman Empire', author: 'Edward Gibbon' },
    { title: 'Guns, Germs, and Steel', author: 'Jared Diamond' }
  ],
  Philosophy: [
    { title: 'Meditations', author: 'Marcus Aurelius' },
    { title: 'The Republic', author: 'Plato' },
    { title: 'Being and Time', author: 'Martin Heidegger' },
    { title: 'The Ethics', author: 'Baruch Spinoza' },
    { title: 'Critique of Pure Reason', author: 'Immanuel Kant' },
    { title: 'The Nicomachean Ethics', author: 'Aristotle' },
    { title: 'The Stranger', author: 'Albert Camus' },
    { title: 'Thus Spoke Zarathustra', author: 'Friedrich Nietzsche' },
    { title: 'The Social Contract', author: 'Jean-Jacques Rousseau' },
    { title: 'Beyond Good and Evil', author: 'Friedrich Nietzsche' }
  ],
  Psychology: [
    { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman' },
    { title: 'The Interpretation of Dreams', author: 'Sigmund Freud' },
    { title: 'Flow', author: 'Mihaly Csikszentmihalyi' },
    { title: 'Influence', author: 'Robert Cialdini' },
    { title: 'The Social Animal', author: 'David Brooks' },
    { title: 'Predictably Irrational', author: 'Dan Ariely' },
    { title: 'The Happiness Hypothesis', author: 'Jonathan Haidt' },
    { title: 'Mindset', author: 'Carol Dweck' },
    { title: 'The Power of Habit', author: 'Charles Duhigg' },
    { title: 'Emotional Intelligence', author: 'Daniel Goleman' }
  ],
  Business: [
    { title: 'Good to Great', author: 'Jim Collins' },
    { title: 'The Lean Startup', author: 'Eric Ries' },
    { title: 'Zero to One', author: 'Peter Thiel' },
    { title: 'The Innovator\'s Dilemma', author: 'Clayton Christensen' },
    { title: 'Built to Last', author: 'Jim Collins' },
    { title: 'The Art of War', author: 'Sun Tzu' },
    { title: 'The 7 Habits of Highly Effective People', author: 'Stephen Covey' },
    { title: 'Think and Grow Rich', author: 'Napoleon Hill' },
    { title: 'The E-Myth Revisited', author: 'Michael Gerber' },
    { title: 'Blue Ocean Strategy', author: 'W. Chan Kim' }
  ],
  Fiction: [
    { title: 'To Kill a Mockingbird', author: 'Harper Lee' },
    { title: '1984', author: 'George Orwell' },
    { title: 'Pride and Prejudice', author: 'Jane Austen' },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { title: 'One Hundred Years of Solitude', author: 'Gabriel García Márquez' },
    { title: 'The Catcher in the Rye', author: 'J.D. Salinger' },
    { title: 'Lord of the Flies', author: 'William Golding' },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien' },
    { title: 'Brave New World', author: 'Aldous Huxley' },
    { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien' }
  ],
  Biography: [
    { title: 'Steve Jobs', author: 'Walter Isaacson' },
    { title: 'Long Walk to Freedom', author: 'Nelson Mandela' },
    { title: 'The Autobiography of Malcolm X', author: 'Malcolm X' },
    { title: 'Benjamin Franklin', author: 'Walter Isaacson' },
    { title: 'Alexander Hamilton', author: 'Ron Chernow' },
    { title: 'Einstein', author: 'Walter Isaacson' },
    { title: 'Churchill', author: 'Martin Gilbert' },
    { title: 'Leonardo da Vinci', author: 'Walter Isaacson' },
    { title: 'My Life', author: 'Bill Clinton' },
    { title: 'Dreams from My Father', author: 'Barack Obama' }
  ],
  'Self-Help': [
    { title: 'How to Win Friends and Influence People', author: 'Dale Carnegie' },
    { title: 'The 4-Hour Workweek', author: 'Timothy Ferriss' },
    { title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki' },
    { title: 'The Power of Now', author: 'Eckhart Tolle' },
    { title: 'Atomic Habits', author: 'James Clear' },
    { title: 'The Miracle Morning', author: 'Hal Elrod' },
    { title: 'You Are a Badass', author: 'Jen Sincero' },
    { title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson' },
    { title: 'Daring Greatly', author: 'Brené Brown' },
    { title: 'The Gifts of Imperfection', author: 'Brené Brown' }
  ],
  Technology: [
    { title: 'The Innovators', author: 'Walter Isaacson' },
    { title: 'The Second Machine Age', author: 'Erik Brynjolfsson' },
    { title: 'Superintelligence', author: 'Nick Bostrom' },
    { title: 'The Singularity Is Near', author: 'Ray Kurzweil' },
    { title: 'The Age of Spiritual Machines', author: 'Ray Kurzweil' },
    { title: 'The Shallows', author: 'Nicholas Carr' },
    { title: 'Digital Minimalism', author: 'Cal Newport' },
    { title: 'The Tech-Wise Family', author: 'Andy Crouch' },
    { title: 'The Network Society', author: 'Manuel Castells' },
    { title: 'Life 3.0', author: 'Max Tegmark' }
  ]
};

// Generate random ISBN
function generateISBN() {
  return `978-${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`;
}

// Generate random image URL (using placeholder images)
function generateImageUrl() {
  const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E9'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return `https://via.placeholder.com/300x400/${color}/FFFFFF?text=Book+Cover`;
}

// Generate 160 more books to reach 200 total
const newBooks = [];
let bookId = 41;

for (let i = 0; i < 160; i++) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const publisher = publishers[Math.floor(Math.random() * publishers.length)];
  const bookTemplate = bookTemplates[category][Math.floor(Math.random() * bookTemplates[category].length)];
  
  // Add variation to titles to avoid duplicates
  const titleVariations = [
    bookTemplate.title,
    `Advanced ${bookTemplate.title}`,
    `The Complete Guide to ${bookTemplate.title}`,
    `${bookTemplate.title}: Extended Edition`,
    `Understanding ${bookTemplate.title}`,
    `${bookTemplate.title} Revisited`
  ];
  
  const title = titleVariations[Math.floor(Math.random() * titleVariations.length)];
  
  const book = {
    id: bookId.toString(),
    title: title,
    author: bookTemplate.author,
    isbn: generateISBN(),
    category: category,
    description: `An excellent ${category.toLowerCase()} book by ${bookTemplate.author}`,
    imageUrl: generateImageUrl(),
    totalCopies: Math.floor(Math.random() * 8) + 2, // 2-9 copies
    availableCopies: Math.floor(Math.random() * 6) + 1, // 1-6 available
    publisher: publisher,
    publishedYear: Math.floor(Math.random() * 30) + 1994 // 1994-2023
  };
  
  newBooks.push(book);
  bookId++;
}

// Combine existing and new books
const allBooks = [...existingBooks, ...newBooks];

// Write back to file
fs.writeFileSync(booksPath, JSON.stringify(allBooks, null, 2));

console.log(`Successfully generated ${newBooks.length} new books!`);
console.log(`Total books in collection: ${allBooks.length}`);
