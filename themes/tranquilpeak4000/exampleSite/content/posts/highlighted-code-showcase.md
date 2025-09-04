---
title: "Highlighted code showcase"
date: 2015-03-23T22:40:32.169Z
description: "This article demonstrates the syntax highlighting features of the Tranquilpeak theme"
thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop"
categories: ["showcase"]
tags: ["highlight-code", "syntax", "programming"]
photos:
  - "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop"
  - "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop"
---

This article demonstrates the syntax highlighting features of the Tranquilpeak theme. The theme supports multiple programming languages with beautiful syntax highlighting.

## JavaScript

```javascript
// JavaScript example with ES6+ features
class Calculator {
    constructor() {
        this.history = [];
    }
    
    add(a, b) {
        const result = a + b;
        this.history.push(`${a} + ${b} = ${result}`);
        return result;
    }
    
    subtract(a, b) {
        const result = a - b;
        this.history.push(`${a} - ${b} = ${result}`);
        return result;
    }
    
    getHistory() {
        return this.history;
    }
}

// Usage
const calc = new Calculator();
console.log(calc.add(5, 3)); // 8
console.log(calc.subtract(10, 4)); // 6
console.log(calc.getHistory());
```

## Python

```python
# Python example with modern features
from typing import List, Optional
from dataclasses import dataclass
import asyncio

@dataclass
class User:
    name: str
    email: str
    age: int
    
    def is_adult(self) -> bool:
        return self.age >= 18

class UserManager:
    def __init__(self):
        self.users: List[User] = []
    
    async def add_user(self, user: User) -> None:
        await asyncio.sleep(0.1)  # Simulate async operation
        self.users.append(user)
    
    def get_adult_users(self) -> List[User]:
        return [user for user in self.users if user.is_adult()]
    
    def find_user_by_email(self, email: str) -> Optional[User]:
        return next((user for user in self.users if user.email == email), None)

# Usage
async def main():
    manager = UserManager()
    user1 = User("Alice", "alice@example.com", 25)
    user2 = User("Bob", "bob@example.com", 16)
    
    await manager.add_user(user1)
    await manager.add_user(user2)
    
    print(f"Adult users: {len(manager.get_adult_users())}")
    print(f"Found user: {manager.find_user_by_email('alice@example.com')}")

if __name__ == "__main__":
    asyncio.run(main())
```

## CSS

```css
/* CSS example with modern features */
:root {
    --primary-color: #007acc;
    --secondary-color: #6c757d;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --border-radius: 0.375rem;
}

.card {
    background: white;
    border-radius: var(--border-radius);
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    padding: 1.5rem;
    margin-bottom: 1rem;
    transition: all 0.3s ease;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.btn {
    display: inline-block;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    text-decoration: none;
    transition: background-color 0.3s ease;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background-color: darken(var(--primary-color), 10%);
}

/* Responsive design */
@media (max-width: 768px) {
    .card {
        padding: 1rem;
    }
    
    .btn {
        width: 100%;
        margin-bottom: 0.5rem;
    }
}
```

## HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern HTML Example</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="hero">
            <h1>Welcome to Our Site</h1>
            <p>This is a modern HTML5 example with semantic elements.</p>
            <button class="btn btn-primary">Get Started</button>
        </section>
        
        <section id="features">
            <article class="card">
                <h2>Feature 1</h2>
                <p>Description of the first feature.</p>
            </article>
            
            <article class="card">
                <h2>Feature 2</h2>
                <p>Description of the second feature.</p>
            </article>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 Your Company. All rights reserved.</p>
    </footer>
    
    <script src="app.js"></script>
</body>
</html>
```

## Go

```go
// Go example with modern features
package main

import (
    "context"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "time"
)

type User struct {
    ID       int    `json:"id"`
    Name     string `json:"name"`
    Email    string `json:"email"`
    Created  string `json:"created_at"`
}

type UserService struct {
    users map[int]User
}

func NewUserService() *UserService {
    return &UserService{
        users: make(map[int]User),
    }
}

func (s *UserService) CreateUser(ctx context.Context, name, email string) (*User, error) {
    select {
    case <-ctx.Done():
        return nil, ctx.Err()
    default:
        // Simulate some work
        time.Sleep(100 * time.Millisecond)
    }
    
    user := User{
        ID:      len(s.users) + 1,
        Name:    name,
        Email:   email,
        Created: time.Now().Format(time.RFC3339),
    }
    
    s.users[user.ID] = user
    return &user, nil
}

func (s *UserService) GetUser(id int) (*User, error) {
    user, exists := s.users[id]
    if !exists {
        return nil, fmt.Errorf("user not found: %d", id)
    }
    return &user, nil
}

func userHandler(service *UserService) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        switch r.Method {
        case "POST":
            var req struct {
                Name  string `json:"name"`
                Email string `json:"email"`
            }
            
            if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
                http.Error(w, err.Error(), http.StatusBadRequest)
                return
            }
            
            ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
            defer cancel()
            
            user, err := service.CreateUser(ctx, req.Name, req.Email)
            if err != nil {
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
            
            w.Header().Set("Content-Type", "application/json")
            json.NewEncoder(w).Encode(user)
            
        case "GET":
            // Handle GET request
            w.Write([]byte("User service is running"))
            
        default:
            http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        }
    }
}

func main() {
    service := NewUserService()
    
    http.HandleFunc("/users", userHandler(service))
    
    log.Println("Server starting on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

## Rust

```rust
// Rust example with modern features
use std::collections::HashMap;
use std::error::Error;
use std::fmt;
use tokio;

#[derive(Debug, Clone)]
struct User {
    id: u32,
    name: String,
    email: String,
}

#[derive(Debug)]
enum UserError {
    NotFound(u32),
    InvalidEmail(String),
}

impl fmt::Display for UserError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            UserError::NotFound(id) => write!(f, "User not found: {}", id),
            UserError::InvalidEmail(email) => write!(f, "Invalid email: {}", email),
        }
    }
}

impl Error for UserError {}

struct UserService {
    users: HashMap<u32, User>,
    next_id: u32,
}

impl UserService {
    fn new() -> Self {
        Self {
            users: HashMap::new(),
            next_id: 1,
        }
    }
    
    fn create_user(&mut self, name: String, email: String) -> Result<User, UserError> {
        if !email.contains('@') {
            return Err(UserError::InvalidEmail(email));
        }
        
        let user = User {
            id: self.next_id,
            name,
            email,
        };
        
        self.users.insert(user.id, user.clone());
        self.next_id += 1;
        
        Ok(user)
    }
    
    fn get_user(&self, id: u32) -> Result<&User, UserError> {
        self.users.get(&id).ok_or(UserError::NotFound(id))
    }
    
    fn list_users(&self) -> Vec<&User> {
        self.users.values().collect()
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let mut service = UserService::new();
    
    // Create some users
    let user1 = service.create_user(
        "Alice".to_string(),
        "alice@example.com".to_string(),
    )?;
    
    let user2 = service.create_user(
        "Bob".to_string(),
        "bob@example.com".to_string(),
    )?;
    
    println!("Created user: {:?}", user1);
    println!("Created user: {:?}", user2);
    
    // Get a user
    let retrieved_user = service.get_user(1)?;
    println!("Retrieved user: {:?}", retrieved_user);
    
    // List all users
    let all_users = service.list_users();
    println!("All users: {:?}", all_users);
    
    Ok(())
}
```

## Conclusion

The Tranquilpeak theme provides excellent syntax highlighting for many programming languages. The highlighting is powered by highlight.js and supports a wide variety of languages and themes. You can customize the highlighting by modifying the theme's CSS or by using different highlight.js themes. 