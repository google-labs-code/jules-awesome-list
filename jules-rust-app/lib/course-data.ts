export interface CourseModule {
    id: string;
    title: string;
    description: string;
    content: string;
    initialCode: string;
    solutionCode: string;
}

export interface CourseTrack {
    id: string;
    title: string;
    description: string;
    icon: string; // E.g., "📊", "🤖", "☁️"
    modules: CourseModule[];
    isBonus?: boolean;
}

const FUNDAMENTALS_MODULES: CourseModule[] = [
    {
        id: "getting-started",
        title: "1. Getting Started",
        description: "Your first Rust program.",
        content: `Welcome to Rust! Let's start with the classic "Hello, World!" program.

Rust is a systems programming language that runs blazingly fast, prevents segfaults, and guarantees thread safety.

In the editor, you'll see a basic function template. Your task is to make it print "Hello, world!".`,
        initialCode: `fn main() {
    // TODO: Print "Hello, world!" to the console
    // Hint: Use the println! macro
    
}`,
        solutionCode: `fn main() {
    println!("Hello, world!");
}`
    },
    {
        id: "basic-syntax",
        title: "2. Basic Syntax",
        description: "Variables and mutability.",
        content: `In Rust, variables are immutable by default. This is a safety feature. To make a variable mutable, you must use the \`mut\` keyword.

Task:
1. Create an immutable variable named \`x\` with value 5.
2. Create a mutable variable named \`y\` with value 10.
3. Print both variables.
4. Change the value of \`y\` to 20 and print it again.`,
        initialCode: `fn main() {
    // TODO: Create immutable variable x
    
    // TODO: Create mutable variable y
    
    // TODO: Print x and y using println!("x: {}, y: {}", x, y);
    
    // TODO: Change y to 20 and print again
}`,
        solutionCode: `fn main() {
    let x = 5;
    let mut y = 10;
    println!("x: {}, y: {}", x, y);
    
    y = 20;
    println!("y is now: {}", y);
}`
    },
    {
        id: "control-flow",
        title: "3. Control Flow",
        description: "If statements and loops.",
        content: `Rust has powerful control flow constructs.

Task:
1. Create a variable \`number\` with value 3.
2. Use an \`if\` statement to check if \`number\` is less than 5.
3. If true, print "condition was true".
4. Create a \`for\` loop that iterates from 0 to 5 (exclusive) and prints the index.`,
        initialCode: `fn main() {
    let number = 3;

    // TODO: Add an if statement checking if number < 5
    
    // TODO: Create a for loop from 0 to 5
}`,
        solutionCode: `fn main() {
    let number = 3;

    if number < 5 {
        println!("condition was true");
    } else {
        println!("condition was false");
    }
    
    for i in 0..5 {
        println!("i is {}", i);
    }
}`
    },
    {
        id: "functions",
        title: "4. Functions",
        description: "Defining and calling functions.",
        content: `Functions are pervasive in Rust code. You've already seen \`main\`.

Task:
1. Define a function named \`five\` that takes no arguments and returns \`5\`.
2. Define a function named \`plus_one\` that takes an \`i32\` and returns \`i32\`.
3. Call both in \`main\` and print the results.`,
        initialCode: `fn main() {
    // TODO: Call your functions here and print results
}

// TODO: Define function 'five'

// TODO: Define function 'plus_one'`,
        solutionCode: `fn main() {
    let x = five();
    let y = plus_one(5);
    
    println!("five() returns: {}", x);
    println!("plus_one(5) returns: {}", y);
}

fn five() -> i32 {
    5
}

fn plus_one(x: i32) -> i32 {
    x + 1
}`
    },
    {
        id: "ownership",
        title: "5. Ownership",
        description: "Rust's unique ownership system.",
        content: `Ownership is Rust's most unique feature.

Rules:
1. Each value in Rust has a variable that's called its owner.
2. There can only be one owner at a time.
3. When the owner goes out of scope, the value will be dropped.

Task:
Demonstrate ownership by creating a String \`s1\`, moving it to \`s2\`, and trying to print \`s2\`. (If you try to print \`s1\` afterwards, it would be a compile error!)`,
        initialCode: `fn main() {
    // TODO: Create a String s1
    
    // TODO: Move s1 to s2
    
    // TODO: Print s2
}`,
        solutionCode: `fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // s1 is moved to s2 here

    println!("s2: {}", s2);
    // println!("s1: {}", s1); // This would cause a compile error!
}`
    },
    {
        id: "structs",
        title: "6. Structs",
        description: "Custom data types.",
        content: `Structs let you name and package together multiple related values.

Task:
1. Define a struct \`User\` with fields \`username\` (String) and \`active\` (bool).
2. Create an instance of \`User\` in main.
3. Print the username.`,
        initialCode: `// TODO: Define struct User

fn main() {
    // TODO: Create instance of User
    
    // TODO: Print username
}`,
        solutionCode: `struct User {
    username: String,
    active: bool,
}

fn main() {
    let user1 = User {
        username: String::from("someusername123"),
        active: true,
    };
    
    println!("Username: {}", user1.username);
}`
    },
    {
        id: "enums",
        title: "7. Enums",
        description: "Enumerations and pattern matching.",
        content: `Enums allow you to define a type by enumerating its possible variants.

Task:
1. Define an enum \`IpAddrKind\` with variants \`V4\` and \`V6\`.
2. Create a function \`route\` that takes \`IpAddrKind\`.
3. Call it with both variants.`,
        initialCode: `// TODO: Define enum IpAddrKind

fn main() {
    // TODO: Call route with V4 and V6
}

// TODO: Define function route`,
        solutionCode: `enum IpAddrKind {
    V4,
    V6,
}

fn route(ip_kind: IpAddrKind) {
    // Logic here
}

fn main() {
    let four = IpAddrKind::V4;
    let six = IpAddrKind::V6;

    route(four);
    route(six);
    
    println!("Routed both IP types successfully.");
}`
    },
    {
        id: "vectors",
        title: "8. Vectors",
        description: "Growable arrays.",
        content: `Vectors allow you to store more than one value in a single data structure that puts all the values next to each other in memory.

Task:
1. Create a mutable vector \`v\` containing integers.
2. Push values 1, 2, and 3 into it.
3. Print the second element (index 1).`,
        initialCode: `fn main() {
    // TODO: Create a mutable vector v
    
    // TODO: Push 1, 2, 3
    
    // TODO: Print the second element
}`,
        solutionCode: `fn main() {
    let mut v = Vec::new();

    v.push(1);
    v.push(2);
    v.push(3);

    println!("The second element is {}", v[1]);
}`
    },
    {
        id: "hashmaps",
        title: "9. HashMaps",
        description: "Key-value storage.",
        content: `HashMaps store data by mapping keys to values.

Task:
1. Create a HashMap \`scores\`.
2. Insert team "Blue" with score 10 and "Red" with score 50.
3. Print the score for "Blue".`,
        initialCode: `use std::collections::HashMap;

fn main() {
    // TODO: Create a HashMap scores
    
    // TODO: Insert teams and scores
    
    // TODO: Print score for "Blue"
}`,
        solutionCode: `use std::collections::HashMap;

fn main() {
    let mut scores = HashMap::new();

    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Red"), 50);

    let team_name = String::from("Blue");
    let score = scores.get(&team_name);
    
    match score {
        Some(s) => println!("Blue team score: {}", s),
        None => println!("Team not found"),
    }
}`
    },
    {
        id: "error-handling",
        title: "10. Error Handling",
        description: "Recoverable errors with Result.",
        content: `Rust groups errors into recoverable (Result) and unrecoverable (panic!) categories.

Task:
1. Define a function \`divide\` that returns \`Result<i32, String>\`.
2. Return \`Ok(answer)\` if division is valid, or \`Err("Division by zero")\` if dividing by 0.
3. Call it in main and handle the result.`,
        initialCode: `fn divide(a: i32, b: i32) -> Result<i32, String> {
    // TODO: Handle division by zero
    // TODO: Return result
    Ok(0) // placeholder
}

fn main() {
    // TODO: Call divide and handle result
}`,
        solutionCode: `fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        return Err(String::from("Division by zero"));
    }
    Ok(a / b)
}

fn main() {
    let result = divide(10, 2);
    
    match result {
        Ok(val) => println!("Result: {}", val),
        Err(e) => println!("Error: {}", e),
    }
}`
    }
];

// DATA SCIENCE MODULES
// DATA SCIENCE MODULES
const DS_MODULES: CourseModule[] = [
    {
        id: "ds-1",
        title: "1. Vectors & Matrices",
        description: "Introduction to numerical computing.",
        content: `Data science relies heavily on linear algebra. In Rust, we use crates like 'ndarray' for n-dimensional arrays.

## Example
\`\`\`rust
let vector = vec![1, 2, 3];
println!("{:?}", vector);
\`\`\`

Task:
1. Create a 1D array (vector) with values [1, 2, 3].
2. Create a 2D array (matrix) 2x2 with values [[1, 0], [0, 1]].
3. Print both.`,
        initialCode: `fn main() {
    // Note: In a real environment, we'd import ndarray
    // use ndarray::arr1;
    
    // TODO: Create a vector [1, 2, 3] (simulated with Vec for this env)
    
    // TODO: Create a 2x2 matrix (simulated with Vec<Vec>)
    
    // TODO: Print them
}`,
        solutionCode: `fn main() {
    let vector = vec![1, 2, 3];
    let matrix = vec![
        vec![1, 0],
        vec![0, 1]
    ];
    
    println!("Vector: {:?}", vector);
    println!("Matrix: {:?}", matrix);
}`
    },
    {
        id: "ds-2",
        title: "2. Reading CSV",
        description: "Parsing CSV files.",
        content: `Reading data from CSV files is a fundamental skill. The 'csv' crate is the standard tool.

Task:
1. Define a struct 'Record' with 'city' (String) and 'population' (u32).
2. Simulate reading a CSV line "Tokyo,37000000".
3. Print the city and population.`,
        initialCode: `struct Record {
    // TODO: Define fields
}

fn main() {
    let csv_line = "Tokyo,37000000";
    // TODO: Parse the line manually or string split for this exercise
    
}`,
        solutionCode: `struct Record {
    city: String,
    population: u32,
}

fn main() {
    let line = "Tokyo,37000000";
    let parts: Vec<&str> = line.split(',').collect();
    
    let record = Record {
        city: parts[0].to_string(),
        population: parts[1].parse().unwrap(),
    };
    
    println!("City: {}, Pop: {}", record.city, record.population);
}`
    },
    {
        id: "ds-3",
        title: "3. DataFrames",
        description: "Working with tabular data.",
        content: `In Rust, 'Polars' is a lightning-fast DataFrame library.

Task:
1. Simulate a DataFrame by creating a vector of users.
2. Each user has 'name' and 'age'.
3. Print the number of rows.`,
        initialCode: `struct User {
    name: String,
    age: u8
}

fn main() {
    // TODO: Create sample data
    
    // TODO: Print count
}`,
        solutionCode: `struct User {
    name: String,
    age: u8
}

fn main() {
    let df = vec![
        User { name: "Alice".into(), age: 30 },
        User { name: "Bob".into(), age: 25 },
        User { name: "Charlie".into(), age: 35 },
    ];
    
    println!("DataFrame has {} rows", df.len());
}`
    },
    {
        id: "ds-4",
        title: "4. Data Cleaning",
        description: "Handling messy data.",
        content: `Real world data is messy. You often need to trim whitespace or handle bad formats.

Task:
1. Given a list of names: [" Alice ", "Bob", " Charlie "].
2. Create a new list with trimmed whitespace.
3. Print the cleaned names.`,
        initialCode: `fn main() {
    let dirty_names = vec![" Alice ", "Bob", " Charlie "];
    
    // TODO: Clean the names
}`,
        solutionCode: `fn main() {
    let dirty_names = vec![" Alice ", "Bob", " Charlie "];
    
    let clean_names: Vec<String> = dirty_names
        .iter()
        .map(|s| s.trim().to_string())
        .collect();
        
    println!("{:?}", clean_names);
}`
    },
    {
        id: "ds-5",
        title: "5. Filtering Data",
        description: "Selecting specific rows.",
        content: `Filtering lets you analyze subsets of data.

Task:
1. Create a list of numbers 1 to 10.
2. Filter for only even numbers.
3. Collect and print the result.`,
        initialCode: `fn main() {
    let numbers = 1..=10;
    
    // TODO: Filter evens
}`,
        solutionCode: `fn main() {
    let evens: Vec<i32> = (1..=10)
        .filter(|&x| x % 2 == 0)
        .collect();
        
    println!("Evens: {:?}", evens);
}`
    },
    {
        id: "ds-6",
        title: "6. Aggregating Data",
        description: "Sum, Min, Max operations.",
        content: `Aggregation summarizes data.

Task:
1. Create a list of sales: [100, 250, 75, 300].
2. Calculate the total sum.
3. Find the maximum sale.`,
        initialCode: `fn main() {
    let sales = vec![100, 250, 75, 300];
    
    // TODO: Calc sum and max
}`,
        solutionCode: `fn main() {
    let sales = vec![100, 250, 75, 300];
    
    let total: i32 = sales.iter().sum();
    let max_sale = sales.iter().max().unwrap();
    
    println!("Total: {}, Max: {}", total, max_sale);
}`
    },
    {
        id: "ds-7",
        title: "7. Handling Missing Values",
        description: "Dealing with Option types.",
        content: `Missing data is represented by Option::None in Rust.

Task:
1. Create a list of Options: [Some(5), None, Some(10)].
2. Filter out the None values.
3. Sum the remaining values.`,
        initialCode: `fn main() {
    let data = vec![Some(5), None, Some(10)];
    
    // TODO: Filter and sum
}`,
        solutionCode: `fn main() {
    let data = vec![Some(5), None, Some(10)];
    
    let sum: i32 = data.iter()
        .filter_map(|x| *x) // unwraps Some, skips None
        .sum();
        
    println!("Sum of valid data: {}", sum);
}`
    },
    {
        id: "ds-8",
        title: "8. Basic Statistics",
        description: "Mean and Standard Deviation.",
        content: `Calculating the mean is a common stats operation.

Task:
1. Create a vector of floats: [10.0, 20.0, 30.0, 40.0].
2. Calculate the average (mean).`,
        initialCode: `fn main() {
    let data = vec![10.0, 20.0, 30.0, 40.0];
    
    // TODO: Calculate mean
}`,
        solutionCode: `fn main() {
    let data = vec![10.0, 20.0, 30.0, 40.0];
    
    let sum: f64 = data.iter().sum();
    let count = data.len() as f64;
    let mean = sum / count;
    
    println!("Mean: {}", mean);
}`
    },
    {
        id: "ds-9",
        title: "9. Plotting Concept",
        description: "Visualizing data.",
        content: `While we can't render GUI plots here, we can do ASCII art plots!

Task:
1. For each value in [1, 3, 5, 2], print that many asterisks on a new line.`,
        initialCode: `fn main() {
    let data = vec![1, 3, 5, 2];
    
    // TODO: Print histogram
}`,
        solutionCode: `fn main() {
    let data = vec![1, 3, 5, 2];
    
    for val in data {
        // print val number of *
        for _ in 0..val {
            print!("*");
        }
        println!("");
    }
}`
    },
    {
        id: "ds-10",
        title: "10. JSON Export",
        description: "Serializing data.",
        content: `Data often needs to be exported. Serde is the standard crate for this.

Task:
1. Define a struct Item { name: String, count: i32 }.
2. Create an instance.
3. Manually format it as a JSON string (e.g. {"name":"...", "count":...}).`,
        initialCode: `struct Item {
    name: String,
    count: i32
}

fn main() {
    // TODO: Create item
    // TODO: Print as JSONish string
}`,
        solutionCode: `struct Item {
    name: String,
    count: i32
}

fn main() {
    let item = Item { name: "Apple".into(), count: 10 };
    
    // Manual JSON serialization simulation
    println!("{{\"name\": \"{}\", \"count\": {}}}", item.name, item.count);
}`
    }
];


// DATA ANALYTICS MODULES
// DATA ANALYTICS MODULES
const DA_MODULES: CourseModule[] = [
    {
        id: "da-1",
        title: "1. Statistical Analysis",
        description: "Calculating variance and standard deviation.",
        content: `Standard Deviation measures the amount of variation or dispersion of a set of values.

## Example
\`\`\`rust
let data = vec![1.0, 2.0, 3.0];
let mean = 2.0;
let variance: f64 = data.iter().map(|&x| (x - mean).powi(2)).sum::<f64>() / 3.0; // 0.66
let std_dev = variance.sqrt();
\`\`\`

Task:
1. Given data: [2, 4, 4, 4, 5, 5, 7, 9].
2. Calculate the mean.
3. Calculate the variance (average of squared differences from the mean).
4. Calculate standard deviation (sqrt of variance).`,
        initialCode: `fn main() {
    let data_points = vec![2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0];
    
    // TODO: Calculate stats
}`,
        solutionCode: `fn main() {
    let data = vec![2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0];
    
    let sum: f64 = data.iter().sum();
    let mean = sum / data.len() as f64;
    
    let variance: f64 = data.iter()
        .map(|value| {
            let diff = mean - value;
            diff * diff
        })
        .sum::<f64>() / data.len() as f64;
        
    let std_dev = variance.sqrt();
    
    println!("Mean: {}, Std Dev: {}", mean, std_dev);
}`
    },
    {
        id: "da-2",
        title: "2. Moving Averages",
        description: "Smoothing time series data.",
        content: `Moving averages smooth out short-term fluctuations.

## Example
\`\`\`rust
let prices = vec![10.0, 11.0, 12.0];
// 2-period moving average
// period 1: (10+11)/2 = 10.5
// period 2: (11+12)/2 = 11.5
\`\`\`

Task:
1. Given prices: [100.0, 102.0, 101.0, 105.0, 110.0].
2. Calculate a 3-period simple moving average.
   - First: avg(100, 102, 101)
   - Second: avg(102, 101, 105)
   - Third: avg(101, 105, 110)`,
        initialCode: `fn main() {
    let prices = vec![100.0, 102.0, 101.0, 105.0, 110.0];
    let window_size = 3;
    
    // TODO: Calculate moving averages
}`,
        solutionCode: `fn main() {
    let prices = vec![100.0, 102.0, 101.0, 105.0, 110.0];
    let window_size = 3;
    
    for i in 0..=(prices.len() - window_size) {
        let window = &prices[i..i+window_size];
        let sum: f64 = window.iter().sum();
        let avg = sum / window_size as f64;
        println!("Window {}: Average {}", i, avg);
    }
}`
    },
    {
        id: "da-3",
        title: "3. Time Series",
        description: "Working with dates and times.",
        content: `Handling dates is crucial. We usually use the 'chrono' crate.

## Example
\`\`\`rust
// Parsing a date (simulated)
let date = "2023-01-01";
let parts: Vec<&str> = date.split('-').collect(); // ["2023", "01", "01"]
\`\`\`

Task:
1. Simulate a date string "2023-10-27".
2. Extract the year, month, and day by splitting the string.
3. Print them in "Day/Month/Year" format.`,
        initialCode: `fn main() {
    let date_str = "2023-10-27";
    
    // TODO: Parse and reformat
}`,
        solutionCode: `fn main() {
    let date_str = "2023-10-27";
    let parts: Vec<&str> = date_str.split('-').collect();
    
    let year = parts[0];
    let month = parts[1];
    let day = parts[2];
    
    println!("{}/{}/{}", day, month, year);
}`
    },
    {
        id: "da-4",
        title: "4. Grouping Data",
        description: "Aggregation by category.",
        content: `Grouping is like SQL GROUP BY.

## Example
\`\`\`rust
let data = vec![("A", 1), ("B", 2), ("A", 3)];
// Sum for A:
let sum_a: i32 = data.iter().filter(|(k, _)| *k == "A").map(|(_, v)| v).sum();
\`\`\`

Task:
1. Given category/value pairs: [("A", 10), ("B", 20), ("A", 30)].
2. Calculate the sum of values for "A".`,
        initialCode: `fn main() {
    let data = vec![("A", 10), ("B", 20), ("A", 30)];
    
    // TODO: Group and sum for "A"
}`,
        solutionCode: `fn main() {
    let data = vec![("A", 10), ("B", 20), ("A", 30)];
    
    let sum_a: i32 = data.iter()
        .filter(|(cat, _)| *cat == "A")
        .map(|(_, val)| val)
        .sum();
        
    println!("Sum for A: {}", sum_a);
}`
    },
    {
        id: "da-5",
        title: "5. Pivot Tables",
        description: "Multidimensional analysis.",
        content: `Pivoting reshapes data.

## Example
\`\`\`rust
// Data: (Row, Col, Val)
// ("Q1", "A", 10), ("Q1", "B", 20)
// Pivot:
//    A   B
// Q1 10  20
\`\`\`

Task:
1. Data: [("Q1", "ProductX", 100), ("Q1", "ProductY", 200), ("Q2", "ProductX", 150)].
2. Find total sales for "ProductX" across all quarters.`,
        initialCode: `fn main() {
    let data = vec![
        ("Q1", "ProductX", 100),
        ("Q1", "ProductY", 200),
        ("Q2", "ProductX", 150)
    ];
    
    // TODO: Sum for ProductX
}`,
        solutionCode: `fn main() {
    let data = vec![
        ("Q1", "ProductX", 100),
        ("Q1", "ProductY", 200),
        ("Q2", "ProductX", 150)
    ];
    
    let total_x: i32 = data.iter()
        .filter(|(_, prod, _)| *prod == "ProductX")
        .map(|(_, _, amt)| amt)
        .sum();
        
    println!("Total ProductX Sales: {}", total_x);
}`
    },
    {
        id: "da-6",
        title: "6. Correlation",
        description: "Relationships between variables.",
        content: `Correlation measures how two variables move together.

## Example
\`\`\`rust
// Perfect positive correlation
let x = vec![1, 2, 3];
let y = vec![2, 4, 6];
// y = 2x
\`\`\`

Task:
1. X: [1, 2, 3], Y: [2, 4, 6].
2. Notice Y = 2 * X. This is perfect positive correlation.
3. Calculate the ratio Y/X for each pair to verify the relationship.`,
        initialCode: `fn main() {
    let x = vec![1, 2, 3];
    let y = vec![2, 4, 6];
    
    // TODO: Check ratio
}`,
        solutionCode: `fn main() {
    let x = vec![1, 2, 3];
    let y = vec![2, 4, 6];
    
    for i in 0..x.len() {
        let ratio = y[i] as f64 / x[i] as f64;
        println!("Ratio at index {}: {}", i, ratio);
    }
    println!("Constant ratio indicates linear correlation.");
}`
    },
    {
        id: "da-7",
        title: "7. Regression Basics",
        description: "Fitting a line.",
        content: `Linear regression fits a line y = mx + c.

## Example
\`\`\`rust
let m = 2.0;
let c = 1.0;
let x = 3.0;
let y_pred = m * x + c; // 7.0
\`\`\`

Task:
1. Given points (1, 2), (2, 4), (3, 6).
2. We know m=2, c=0.
3. Predict y for x=4 using the formula.`,
        initialCode: `fn main() {
    let m = 2;
    let c = 0;
    let x = 4;
    
    // TODO: Predict y
}`,
        solutionCode: `fn main() {
    let m = 2;
    let c = 0;
    let x = 4;
    
    let y = m * x + c;
    println!("Prediction for x=4 is y={}", y);
}`
    },
    {
        id: "da-8",
        title: "8. Data Visualization",
        description: "Simple text charts.",
        content: `Visualizing data helps understanding.

## Example
\`\`\`rust
// Bar chart for [1, 2]
// | |
// | | |
\`\`\`

Task:
1. Create a vertical bar chart for values [1, 3, 2].
2. Print rows from top (max height) to bottom.`,
        initialCode: `fn main() {
    let data = vec![1, 3, 2];
    
    // TODO: Print ASCII bar chart
}`,
        solutionCode: `fn main() {
    let data = vec![1, 3, 2];
    let max = *data.iter().max().unwrap();
    
    for h in (1..=max).rev() {
        for &val in &data {
            if val >= h {
                print!("| ");
            } else {
                print!("  ");
            }
        }
        println!("");
    }
    println!("-----");
}`
    },
    {
        id: "da-9",
        title: "9. Reporting",
        description: "Generating summaries.",
        content: `Reports summarize key metrics.

## Example
\`\`\`rust
let rev = 100.0;
let cost = 80.0;
let profit = rev - cost;
println!("Profit: {}", profit);
\`\`\`

Task:
1. Given revenue: 5000, expenses: 3000.
2. Calculate profit margin percentage ((rev - exp) / rev).
3. Print a formatted report line.`,
        initialCode: `fn main() {
    let revenue = 5000.0;
    let expenses = 3000.0;
    
    // TODO: Calc margin and print
}`,
        solutionCode: `fn main() {
    let revenue = 5000.0;
    let expenses = 3000.0;
    
    let profit = revenue - expenses;
    let margin = (profit / revenue) * 100.0;
    
    println!("--- Financial Report ---");
    println!("Revenue:  \${}", revenue);
    println!("Expenses: \${}", expenses);
    println!("Profit:   \${}", profit);
    println!("Margin:   {}%", margin);
}`
    },
    {
        id: "da-10",
        title: "10. Polars Deep Dive",
        description: "Lazy vs Eager evaluation.",
        content: `Polars supports Lazy execution for optimization.

## Example
\`\`\`rust
// Eager (Vec):
let v = vec![1, 2, 3]; // memory used now
// Lazy:
// let q = df.lazy().filter(...); // no work done yet
\`\`\`

Task:
1. Explain the difference between Eager (immediate) and Lazy (planned) execution in a print statement.
2. Simulate a "LazyFrame" plan by printing "Plan: Filter -> GroupBy -> Sum".`,
        initialCode: `fn main() {
    // TODO: Explain Lazy vs Eager
}`,
        solutionCode: `fn main() {
    println!("Eager: Executes immediately, returns result.");
    println!("Lazy: Builds a query plan, optimizes, then executes.");
    
    println!("Simulated Plan: Scan CSV -> Filter(year > 2020) -> Sum(revenue)");
}`
    }
];


// MACHINE LEARNING MODULES
// MACHINE LEARNING MODULES
const ML_MODULES: CourseModule[] = [
    {
        id: "ml-1",
        title: "1. Linear Regression",
        description: "Predicting continuous values.",
        content: `Linear Regression attempts to model the relationship between two variables.

## Example
\`\`\`rust
// Equation: y = 3x + 2
let x = 4.0;
let y = 3.0 * x + 2.0; // 14.0
\`\`\`

Task:
1. Model: y = 2x + 1.
2. Given input x = 5.
3. Calculate predicted y.`,
        initialCode: `fn main() {
    let x = 5.0;
    
    // TODO: Predict y where m=2, c=1
}`,
        solutionCode: `fn main() {
    let x = 5.0;
    let m = 2.0;
    let c = 1.0;
    
    let y = m * x + c;
    println!("Predicted y: {}", y);
}`
    },
    {
        id: "ml-2",
        title: "2. Logistic Regression",
        description: "Classification problems.",
        content: `Logistic Regression outputs a probability between 0 and 1 using the Sigmoid function.

Sigmoid(z) = 1 / (1 + e^-z)

## Example
\`\`\`rust
let z = 0.0;
let p = 1.0 / (1.0 + (-0.0 as f64).exp()); // 0.5
\`\`\`

Task:
1. Implement the sigmoid function.
2. Calculate sigmoid(0.0). Should be 0.5.`,
        initialCode: `fn main() {
    let z = 0.0;
    
    // TODO: Calc sigmoid
}`,
        solutionCode: `fn main() {
    let z = 0.0;
    let sigmoid = 1.0 / (1.0 + (-z).exp());
    
    println!("Sigmoid({}) = {}", z, sigmoid);
}`
    },
    {
        id: "ml-3",
        title: "3. K-Means Clustering",
        description: "Unsupervised grouping.",
        content: `K-Means groups data into k clusters based on distance.

## Example
\`\`\`rust
// 1D distance
let p = 2.0;
let c1 = 1.0;
let c2 = 10.0;
// |p-c1| = 1, |p-c2| = 8 -> Assign to C1
\`\`\`

Task:
1. Point P(1, 1). Centroids C1(0, 0) and C2(5, 5).
2. Calculate Euclidean distance from P to C1 and C2.
3. Determine which centroid is closer.`,
        initialCode: `fn main() {
    let p = (1.0, 1.0);
    let c1 = (0.0, 0.0);
    let c2 = (5.0, 5.0);
    
    // TODO: Calc distances and compare
}`,
        solutionCode: `fn main() {
    let p = (1.0, 1.0);
    let c1 = (0.0, 0.0);
    let c2 = (5.0, 5.0);
    
    let d1 = ((p.0 - c1.0).powi(2) + (p.1 - c1.1).powi(2)).sqrt();
    let d2 = ((p.0 - c2.0).powi(2) + (p.1 - c2.1).powi(2)).sqrt();
    
    println!("Dist to C1: {:.2}, Dist to C2: {:.2}", d1, d2);
    
    if d1 < d2 {
        println!("Closer to C1");
    } else {
        println!("Closer to C2");
    }
}`
    },
    {
        id: "ml-4",
        title: "4. K-Nearest Neighbors",
        description: "Classification by proximity.",
        content: `KNN looks at the 'k' closest points to classify a new point.

## Example
\`\`\`rust
// New point is ?
// Neighbors: [Red, Red, Blue]
// Majority vote -> Red
\`\`\`

Task:
1. Neighbors: [ClassA, ClassA, ClassB].
2. Count the votes.
3. Determine the winning class.`,
        initialCode: `fn main() {
    let neighbors = vec!["A", "A", "B"];
    
    // TODO: Count votes
}`,
        solutionCode: `fn main() {
    let neighbors = vec!["A", "A", "B"];
    
    let mut count_a = 0;
    let mut count_b = 0;
    
    for n in neighbors {
        if n == "A" { count_a += 1; }
        else { count_b += 1; }
    }
    
    if count_a > count_b {
        println!("Classified as A");
    } else {
        println!("Classified as B");
    }
}`
    },
    {
        id: "ml-5",
        title: "5. Decision Trees",
        description: "Branching logic.",
        content: `Decision trees split data based on feature values.

## Example
\`\`\`rust
let age = 20;
if age > 18 {
    println!("Can vote");
} else {
    println!("Cannot vote");
}
\`\`\`

Task:
1. If 'weather' is "sunny", predict "play".
2. Else if 'weather' is "rainy", predict "stay inside".
3. Else predict "unknown".`,
        initialCode: `fn main() {
    let weather = "rainy";
    
    // TODO: Decision logic
}`,
        solutionCode: `fn main() {
    let weather = "rainy";
    
    if weather == "sunny" {
        println!("Prediction: play");
    } else if weather == "rainy" {
        println!("Prediction: stay inside");
    } else {
        println!("Prediction: unknown");
    }
}`
    },
    {
        id: "ml-6",
        title: "6. Random Forests",
        description: "Ensemble learning.",
        content: `Random Forests average predictions from multiple trees to reduce overfitting.

## Example
\`\`\`rust
// Tree 1: 10
// Tree 2: 20
// RF Prediction: (10 + 20) / 2 = 15
\`\`\`

Task:
1. Tree predictions: [10.0, 12.0, 8.0].
2. Calculate the average prediction.`,
        initialCode: `fn main() {
    let preds = vec![10.0, 12.0, 8.0];
    
    // TODO: Average
}`,
        solutionCode: `fn main() {
    let preds = vec![10.0, 12.0, 8.0];
    
    let sum: f64 = preds.iter().sum();
    let avg = sum / preds.len() as f64;
    
    println!("Ensemble Prediction: {}", avg);
}`
    },
    {
        id: "ml-7",
        title: "7. Support Vector Machines",
        description: "Finding the best boundary.",
        content: `SVM finds the hyperplane that best divides classes.

## Example
\`\`\`rust
// Boundary x = 0
let point = -5;
// if point < 0 -> Class Left
// if point > 0 -> Class Right
\`\`\`

Task:
1. Decision boundary: 2x - y = 0.
2. Point (3, 5).
3. Evaluate value = 2(3) - 5.
4. If > 0 class A, else class B.`,
        initialCode: `fn main() {
    let x = 3;
    let y = 5;
    
    // TODO: Classify
}`,
        solutionCode: `fn main() {
    let x = 3;
    let y = 5;
    
    let val = 2 * x - y;
    
    if val > 0 {
        println!("Class A");
    } else {
        println!("Class B");
    }
}`
    },
    {
        id: "ml-8",
        title: "8. Model Evaluation",
        description: "Accuracy and Confusion Matrix.",
        content: `Accuracy = Correct Predictions / Total Predictions.

## Example
\`\`\`rust
// Pred:  [1, 0]
// True:  [1, 1]
// match, miss -> 1/2 = 50%
\`\`\`

Task:
1. Predicted: [1, 0, 1], Actual: [1, 1, 1].
2. Count correct matches.
3. Calculate accuracy %`,
        initialCode: `fn main() {
    let pred = vec![1, 0, 1];
    let actual = vec![1, 1, 1];
    
    // TODO: Calc accuracy
}`,
        solutionCode: `fn main() {
    let pred = vec![1, 0, 1];
    let actual = vec![1, 1, 1];
    
    let mut correct = 0;
    let total = pred.len();
    
    for i in 0..total {
        if pred[i] == actual[i] {
            correct += 1;
        }
    }
    
    println!("Accuracy: {:.2}%", (correct as f64 / total as f64) * 100.0);
}`
    },
    {
        id: "ml-9",
        title: "9. Model Persistence",
        description: "Saving and loading models.",
        content: `We often serialize models to disk.

## Example
\`\`\`rust
// Saved model JSON
// { "weights": [0.1, 0.5], "bias": 0.0 }
\`\`\`

Task:
1. Struct Model { slope: f64 }.
2. "Save" it by printing its JSON representation.`,
        initialCode: `struct Model { slope: f64 }

fn main() {
    let model = Model { slope: 2.5 };
    
    // TODO: Save
}`,
        solutionCode: `struct Model { slope: f64 }

fn main() {
    let model = Model { slope: 2.5 };
    
    println!("Saving model: {{ \"slope\": {} }}", model.slope);
}`
    },
    {
        id: "ml-10",
        title: "10. Linfa Crate",
        description: "Rust's ML Toolkit.",
        content: `Linfa is the Rust equivalent of Scikit-Learn.

## Example
\`\`\`rust
// use linfa::prelude::*;
// let model = KMeans::params(3).fit(&dataset)?;
\`\`\`

Task:
1. Print a statement describing what 'Linfa' does.
2. Mention 2 algorithms it supports (e.g. KMeans, Logistic Regression).`,
        initialCode: `fn main() {
    // TODO: Describe Linfa
}`,
        solutionCode: `fn main() {
    println!("Linfa aims to provide a comprehensive toolkit for ML in Rust.");
    println!("It supports algorithms like K-Means, Logistic Regression, and SVM.");
}`
    }
];


// AI MODULES
// AI MODULES
const AI_MODULES: CourseModule[] = [
    {
        id: "ai-1",
        title: "1. Tensors",
        description: "Multi-dimensional arrays.",
        content: `Tensors are the fundamental data block of AI.

## Example
\`\`\`rust
// 2x2 Tensor
// [[1, 2],
//  [3, 4]]
let shape = [2, 2];
\`\`\`

Task:
1. Simulate a 3D tensor of shape [2, 2, 2].
2. Fill it with zeros.
3. Print its "shape".`,
        initialCode: `fn main() {
    // TODO: Simulate tensor
}`,
        solutionCode: `fn main() {
    // Simplified simulation
    println!("Tensor created.");
    println!("Shape: [2, 2, 2]");
    println!("Data: [[[0,0], [0,0]], [[0,0], [0,0]]]");
}`
    },
    {
        id: "ai-2",
        title: "2. Auto-Differentiation",
        description: "Calculating gradients.",
        content: `Auto-diff allows us to calculate derivatives automatically for backpropagation.

## Example
\`\`\`rust
// f(x) = x^2
// f'(x) = 2x
// at x=2, slope=4
\`\`\`

Task:
1. Function: f(x) = x^2.
2. Derivative: f'(x) = 2x.
3. Calculate f'(3).`,
        initialCode: `fn main() {
    let x = 3.0;
    
    // TODO: Calc grad
}`,
        solutionCode: `fn main() {
    let x = 3.0;
    let grad = 2.0 * x;
    
    println!("Gradient of x^2 at 3 is {}", grad);
}`
    },
    {
        id: "ai-3",
        title: "3. Neural Networks",
        description: "Layers of neurons.",
        content: `A simple neuron: output = activation(weights * input + bias).

## Example
\`\`\`rust
let i = 1.0; let w = 0.5; let b = 0.1;
let z = w*i + b; // 0.6
let out = z.max(0.0); // ReLU
\`\`\`

Task:
1. Input: 0.5, Weight: 2.0, Bias: -1.0.
2. Calculate linear output (w*i + b).
3. Apply ReLU (max(0, x)).`,
        initialCode: `fn main() {
    let input = 0.5;
    let weight = 2.0;
    let bias = -1.0;
    
    // TODO: Calc output
}`,
        solutionCode: `fn main() {
    let input = 0.5;
    let weight = 2.0;
    let bias = -1.0;
    
    let linear = weight * input + bias;
    let output = if linear > 0.0 { linear } else { 0.0 };
    
    println!("Output: {}", output);
}`
    },
    {
        id: "ai-4",
        title: "4. Activation Functions",
        description: "Non-linearity.",
        content: `Activation functions introduce non-linearity.

## Example
\`\`\`rust
fn relu(x: f64) -> f64 {
    if x > 0.0 { x } else { 0.0 }
}
\`\`\`

Task:
1. Implement ReLU: max(0, x).
2. Implement Tanh: (e^x - e^-x) / (e^x + e^-x).
3. Test with x = -0.5.`,
        initialCode: `fn main() {
    let x = -0.5;
    
    // TODO: Implement activations
}`,
        solutionCode: `fn main() {
    let x = -0.5;
    
    let relu = if x > 0.0 { x } else { 0.0 };
    let e_x = x.exp();
    let e_neg_x = (-x).exp();
    let tanh = (e_x - e_neg_x) / (e_x + e_neg_x);
    
    println!("ReLU: {}, Tanh: {:.4}", relu, tanh);
}`
    },
    {
        id: "ai-5",
        title: "5. Loss Functions",
        description: "Measuring error.",
        content: `MSE (Mean Squared Error) is common for regression.

## Example
\`\`\`rust
let err1 = (1.0 - 0.8) * (1.0 - 0.8);
let err2 = (0.0 - 0.1) * (0.0 - 0.1);
let mse = (err1 + err2) / 2.0;
\`\`\`

Task:
1. True: [1.0, 0.0], Pred: [0.8, 0.1].
2. Calculate squared diff for each.
3. Average them.`,
        initialCode: `fn main() {
    let targets = vec![1.0, 0.0];
    let preds = vec![0.8, 0.1];
    
    // TODO: Calc MSE
}`,
        solutionCode: `fn main() {
    let targets = vec![1.0, 0.0];
    let preds = vec![0.8, 0.1];
    
    let mut sum_sq_diff = 0.0;
    for i in 0..targets.len() {
        let diff = targets[i] - preds[i];
        sum_sq_diff += diff * diff;
    }
    
    let mse = sum_sq_diff / targets.len() as f64;
    println!("MSE: {:.4}", mse);
}`
    },
    {
        id: "ai-6",
        title: "6. Optimizers",
        description: "SGD steps.",
        content: `SGD updates weights: w = w - learning_rate * grad.

## Example
\`\`\`rust
let mut w = 5.0;
let lr = 0.1;
let grad = 1.0;
w -= lr * grad; // 4.9
\`\`\`

Task:
1. Weight: 10.0, Grad: 2.0, LR: 0.1.
2. Update weight 5 times.
3. Grad is constant 2.0 (simplified).`,
        initialCode: `fn main() {
    let mut w = 10.0;
    let grad = 2.0;
    let lr = 0.1;
    
    // TODO: Update loop
}`,
        solutionCode: `fn main() {
    let mut w = 10.0;
    let grad = 2.0;
    let lr = 0.1;
    
    for i in 1..=5 {
        w = w - lr * grad;
        println!("Step {}: w = {:.2}", i, w);
    }
}`
    },
    {
        id: "ai-7",
        title: "7. Training Loops",
        description: "Epochs and batches.",
        content: `A training loop iterates over epochs using batches.

## Example
\`\`\`rust
for epoch in 0..10 {
    // shuffle data
    // for batch in chunks...
    //   update()
}
\`\`\`

Task:
1. 3 Epochs.
2. Per epoch, print "Epoch X starting...".
3. Sim "Batch processed.".`,
        initialCode: `fn main() {
    let epochs = 3;
    
    // TODO: Loop
}`,
        solutionCode: `fn main() {
    let epochs = 3;
    for i in 1..=epochs {
        println!("Epoch {} starting...", i);
        println!("  Processing batches...");
        println!("Epoch {} done.", i);
    }
}`
    },
    {
        id: "ai-8",
        title: "8. Inference",
        description: "Using the model.",
        content: `Inference is the forward pass without gradient tracking.

## Example
\`\`\`rust
let model = load_model();
let output = model.predict(input_data);
\`\`\`

Task:
1. Simulate a trained model function: f(x) = 3x (weights fixed).
2. Predict for x=4.`,
        initialCode: `fn main() {
    let x = 4.0;
    
    // TODO: Predict
}`,
        solutionCode: `fn main() {
    let x = 4.0;
    let w_trained = 3.0;
    
    let y = w_trained * x;
    println!("Inference output: {}", y);
}`
    },
    {
        id: "ai-9",
        title: "9. Burn Crate",
        description: "Deep Learning in Rust.",
        content: `Burn is a modern DL framework for Rust.

## Example
\`\`\`rust
// use burn::tensor::Tensor;
// let t = Tensor::from_floats([1.0, 2.0]);
\`\`\`

Task:
1. Define a Struct 'MyModel' (empty).
2. Implement specific trait 'Module' (simulated by impl block).
3. Print "Backends: WGPU, Torch, NdArray".`,
        initialCode: `struct MyModel;
// TODO: Sim module
fn main() {
    // TODO: Print backends
}`,
        solutionCode: `struct MyModel;

impl MyModel {
    fn forward(&self) {
        println!("Forward pass");
    }
}

fn main() {
    let m = MyModel;
    m.forward();
    println!("Burn supports backends: WGPU, Torch, NdArray.");
}`
    },
    {
        id: "ai-10",
        title: "10. Computer Vision",
        description: "Processing images.",
        content: `Images are tensors (Height, Width, Channels).

## Example
\`\`\`rust
// RGB pixel = [255, 0, 0] (Red)
// Image = Matrix of pixels
\`\`\`

Task:
1. Sim 2x2 Grayscale image (0-255).
2. Flatten it to a vector.
3. Normalize (divide by 255.0).`,
        initialCode: `fn main() {
    let img = vec![
        vec![0, 255],
        vec![128, 64]
    ];
    
    // TODO: Flatten and normalize
}`,
        solutionCode: `fn main() {
    let img = vec![
        vec![0, 255],
        vec![128, 64]
    ];
    
    let mut flattened = Vec::new();
    for row in img {
        for pixel in row {
            flattened.push(pixel as f32 / 255.0);
        }
    }
    
    println!("Normalized: {:?}", flattened);
}`
    }
];

// CLOUD COMPUTING MODULES
// CLOUD COMPUTING MODULES
const CLOUD_MODULES: CourseModule[] = [
    {
        id: "cloud-1",
        title: "1. Async Rust",
        description: "Asynchronous programming.",
        content: `Async/Await allows concurrent execution without threads.

## Example
\`\`\`rust
async fn do_work() {
    // ...
}
// await it in a runtime
\`\`\`

Task:
1. Define an async function 'hello' that prints "Hello".
2. Explain that you can't call it directly in main without a runtime (simulated).`,
        initialCode: `async fn hello() {
    println!("Hello");
}

fn main() {
    // TODO: Call hello?
}`,
        solutionCode: `async fn hello() {
    println!("Hello");
}

fn main() {
    // In real Rust, we need: tokio::main or block_on
    println!("Cannot call async function directly in main!");
    println!("We need a runtime executor like Tokio.");
}`
    },

    {
        id: "cloud-2",
        title: "2. Tokio Runtime",
        description: "The most popular runtime.",
        content: `Tokio executes async tasks.

## Example
\`\`\`rust
#[tokio::main]
async fn main() {
    let handle = tokio::spawn(async { ... });
    handle.await;
}
\`\`\`

Task:
1. Simulate spawning a task.
2. Print "Task spawned".`,
        initialCode: `fn main() {
    // TODO: Sim tokio::spawn
}`,
        solutionCode: `fn main() {
    println!("tokio::spawn(async {");
    println!("    println!(\"Task running on thread pool\");");
    println!("});");
}`
    },
    {
        id: "cloud-3",
        title: "3. HTTP Requests",
        description: "Making API calls.",
        content: `Reqwest is the standard HTTP client.

## Example
\`\`\`rust
let body = reqwest::get("https://httpbin.org/get")
    .await?
    .text()
    .await?;
\`\`\`

Task:
1. Sim GET request to "https://api.rust.com".
2. Sim receiving status 200.`,
        initialCode: `fn main() {
    let url = "https://api.rust.com";
    
    // TODO: Sim GET
}`,
        solutionCode: `fn main() {
    let url = "https://api.rust.com";
    println!("Sending GET to {}", url);
    println!("Response: Status 200 OK");
}`
    },
    {
        id: "cloud-4",
        title: "4. Axum Web Framework",
        description: "Building web servers.",
        content: `Axum is a modular web framework.

## Example
\`\`\`rust
let app = Router::new()
    .route("/", get(|| async { "Hello!" }));
\`\`\`

Task:
1. Define a handler function 'root' returning "Welcome".
2. Sim defining a router.`,
        initialCode: `async fn root() -> &'static str {
    "Welcome"
}

fn main() {
    // TODO: Router sim
}`,
        solutionCode: `async fn root() -> &'static str {
    "Welcome"
}

fn main() {
    println!("Router::new().route(\"/\", get(root));");
    println!("Server listening on 0.0.0.0:3000");
}`
    },
    {
        id: "cloud-5",
        title: "5. Database Connection",
        description: "SQLx for async SQL.",
        content: `SQLx is an async, type-safe SQL toolkit.

## Example
\`\`\`rust
let row: (i64,) = sqlx::query_as("SELECT count(*) FROM users")
    .fetch_one(&pool).await?;
\`\`\`

Task:
1. Sim connecting to Postgres.
2. Sim query "SELECT * FROM users".`,
        initialCode: `fn main() {
    let db_url = "postgres://localhost/db";
    
    // TODO: Sim connect
}`,
        solutionCode: `fn main() {
    println!("Connecting to postgres://localhost/db...");
    println!("Connected.");
    println!("Running: SELECT * FROM users");
}`
    },
    {
        id: "cloud-6",
        title: "6. Dockerizing Rust",
        description: "Containerization.",
        content: `Multi-stage builds reduce image size.

## Example
\`\`\`dockerfile
FROM rust as builder
RUN cargo build --release
FROM debian
COPY --from=builder /app/target/release/app .
\`\`\`

Task:
1. Print the 'builder' stage using 'rust:latest'.
2. Print the 'runtime' stage using 'debian:buster-slim'.`,
        initialCode: `fn main() {
    // TODO: Print Dockerfile content
}`,
        solutionCode: `fn main() {
    println!("FROM rust:latest as builder");
    println!("cargo build --release");
    println!("FROM debian:buster-slim");
    println!("COPY --from=builder /target/release/app .");
}`
    },
    {
        id: "cloud-7",
        title: "7. AWS Lambda",
        description: "Serverless functions.",
        content: `Rust is perfect for Lambda due to fast cold starts.

## Example
\`\`\`rust
// Handler
async fn func(event: LambdaEvent<Value>) -> Result<_, Error> {
    Ok("Success")
}
\`\`\`

Task:
1. Sim handling a Lambda event.
2. Return "Hello from Lambda".`,
        initialCode: `fn main() {
    // TODO: Sim lambda_runtime::run
}`,
        solutionCode: `fn main() {
    println!("Received event: {{ \"key\": \"value\" }}");
    println!("Returning: Ok(\"Hello from Lambda\")");
}`
    },
    {
        id: "cloud-8",
        title: "8. Serverless",
        description: "No server management.",
        content: `Serverless means you just deploy code.

## Example
\`\`\`text
User -> API Gateway -> Lambda (Rust Code) -> DynamoDB
\`\`\`

Task:
1. Compare "Server" vs "Serverless" in a print statement.`,
        initialCode: `fn main() {
    // TODO: Compare
}`,
        solutionCode: `fn main() {
    println!("Server: You manage updates, scaling, OS.");
    println!("Serverless: You upload code, provider scales it.");
}`
    },
    {
        id: "cloud-9",
        title: "9. S3 & Storage",
        description: "Object storage.",
        content: `AWS S3 stores blobs of data.

## Example
\`\`\`rust
// s3://my-bucket/puppy.jpg
client.put_object().bucket("b").key("k").send().await?;
\`\`\`

Task:
1. Sim putting a file "data.txt" to bucket "my-bucket".`,
        initialCode: `fn main() {
    let bucket = "my-bucket";
    let file = "data.txt";
    
    // TODO: Sim PutObject
}`,
        solutionCode: `fn main() {
    let bucket = "my-bucket";
    let file = "data.txt";
    
    println!("s3_client.put_object().bucket({}).key({})", bucket, file);
    println!("Upload successful.");
}`
    },
    {
        id: "cloud-10",
        title: "10. Microservices",
        description: "Distributed systems.",
        content: `Microservices chat over networks (gRPC/REST).

## Example
\`\`\`text
[Order Service] --HTTP--> [Payment Service]
\`\`\`

Task:
1. Service A calls Service B.
2. Print the log of this interaction.`,
        initialCode: `fn main() {
    // TODO: Sim interaction
}`,
        solutionCode: `fn main() {
    println!("Service A: Sending ID 123 to Service B");
    println!("Service B: Processing ID 123...");
    println!("Service B: Returning UserData");
    println!("Service A: Received UserData");
}`
    }
];



// AI MATHEMATICS MODULES
const AI_MATH_MODULES: CourseModule[] = [
    {
        id: "ai-linear-scalar",
        title: "Linear Algebra: Scalars",
        description: "The fundamental units of data in AI.",
        content: `## What is a Scalar?

In Linear Algebra, a **scalar** is a single number. It contrasts with vectors and matrices, which are arrays of numbers.
In the context of AI and Deep Learning, scalars are used to represent:
- **Learning Rates**: How big of a step we take during optimization.
- **Loss Values**: A single number representing how "wrong" our model is.
- **Weights**: Sometimes individual parameters are manipulated as scalars.

### Scalars in Rust
In Rust, scalars are simply integers (\`i32\`, \`u64\`) or floating-point numbers (\`f32\`, \`f64\`).
When we perform operations like \`2.0 * 5.0\`, we are doing **scalar multiplication**.

## Task
1. Create a scalar variable \`learning_rate\` equal to \`0.01\`.
2. Create a variable \`epochs\` (integer) equal to \`100\`.
3. Simulate a simple decay: multiply \`learning_rate\` by \`0.95\` inside a loop (run it 5 times).
4. Print the final learning rate.`,
        initialCode: `fn main() {
    // TODO: Define learning_rate
    
    // TODO: Define epochs
    
    // TODO: Loop 5 times and decay the learning rate
    
    // TODO: Print result
}`,
        solutionCode: `fn main() {
    let mut learning_rate = 0.01;
    let epochs = 100; // Not used in calculation but good for context
    
    // Decay loop
    for _ in 0..5 {
        learning_rate = learning_rate * 0.95;
    }
    
    println!("Final learning rate: {:.4}", learning_rate);
}`
    },
    {
        id: "ai-calculus-derivatives",
        title: "Calculus: Derivatives",
        description: "Understanding rates of change.",
        content: `## The Derivative
        
Calculus is the study of change. The **derivative** measures how a function changes as its input changes - intuitively, it's the "slope" at a specific point.

For a function $f(x) = x^2$, the derivative is $f'(x) = 2x$.
This means if you are at $x=3$, the rate of change is $2(3) = 6$.

### Numerical Differentiation
Computers often approximate derivatives using the **difference quotient**:
$$ f'(x) \\approx \\frac{f(x + h) - f(x)}{h} $$
where $h$ is a very small number (e.g., 0.0001).

## Task
1. Define a function \`f(x)\` that returns $x^2$.
2. Define a function \`derivative(x, h)\` that implements the formula above.
3. Calculate the approximate slope at $x=3.0$ with $h=0.0001$.`,
        initialCode: `fn main() {
    let x = 3.0;
    let h = 0.0001;
    
    // TODO: Print the approximate derivative
}

fn f(x: f64) -> f64 {
    // TODO: Return x squared
    0.0
}

fn derivative_approx(x: f64, h: f64) -> f64 {
    // TODO: Implement (f(x+h) - f(x)) / h
    0.0
}`,
        solutionCode: `fn main() {
    let x = 3.0;
    let h = 0.0001;
    
    let slope = derivative_approx(x, h);
    println!("Approx slope at x=3.0 is {:.4} (Expected: 6.0)", slope);
}

fn f(x: f64) -> f64 {
    x * x
}

fn derivative_approx(x: f64, h: f64) -> f64 {
    (f(x + h) - f(x)) / h
}`
    },
    {
        id: "ai-prob-bernoulli",
        title: "Prob & Stat: Bernoulli",
        description: "The coin flip of probability distributions.",
        content: `## Bernoulli Distribution
        
The **Bernoulli distribution** models a single experiment with two possible outcomes: "Success" (1) and "Failure" (0). 
It is the building block for more complex distributions.

- Probability of Success: $p$
- Probability of Failure: $1 - p$

### Task
Simulate a biased coin flip where probability of heads ($p$) is 0.7.
1. Create a "random" float between 0.0 and 1.0 (hardcode a value to simulate it, e.g., 0.6).
2. If the value is less than $p$ (0.7), print "Heads (1)".
3. Otherwise, print "Tails (0)".`,
        initialCode: `fn main() {
    let p = 0.7; // Probability of heads
    let random_val = 0.6; // Simulating a random number generator output
    
    // TODO: Check if random_val < p and print result
}`,
        solutionCode: `fn main() {
    let p = 0.7;
    let random_val = 0.6;
    
    if random_val < p {
        println!("Heads (1)");
    } else {
        println!("Tails (0)");
    }
}`
    },
    {
        id: "ai-opt-gradient",
        title: "Optimization: Gradient Descent",
        description: "How machines learn by minimizing error.",
        content: `## Gradient Descent
        
To train a neural network, we want to find weights $w$ that minimize the error (Loss $L$). 
We do this by taking small steps opposite to the gradient (the direction of steepest value increase).

**Update Rule:**
$$ w_{new} = w_{old} - \\text{learning\\_rate} \\times \\text{gradient} $$

### Task
1. Given current weight $w = 10.0$.
2. Gradient $\\nabla L = 2.0$.
3. Learning rate $\\eta = 0.1$.
4. Perform one update step and print the new weight.`,
        initialCode: `fn main() {
    let mut w = 10.0;
    let gradient = 2.0;
    let lr = 0.1;
    
    // TODO: Update w
    // TODO: Print new w
}`,
        solutionCode: `fn main() {
    let mut w = 10.0;
    let gradient = 2.0;
    let lr = 0.1;
    
    w = w - (lr * gradient);
    
    println!("New weight: {:.1}", w);
}`
    },
    {
        id: "ai-graph-adj",
        title: "Graph Theory: Adjacency Matrix",
        description: "Representing networks and connections.",
        content: `## Graphs
        
A graph consists of **Nodes** (vertices) and **Edges** (connections). 
In AI, graphs are used for knowledge bases, social networks, and even neural network architectures.

One way to represent a graph is an **Adjacency Matrix**. For 3 nodes (0, 1, 2):
\`\`\`text
   0 1 2
0 [0 1 0]  <- Node 0 connects to 1
1 [1 0 1]  <- Node 1 connects to 0 and 2
2 [0 1 0]  <- Node 2 connects to 1
\`\`\`

### Task
1. Create a 3x3 matrix (vector of vectors) representing the graph above.
2. Check if Node 0 matches with Node 1 (row 0, col 1) and print "Connected".`,
        initialCode: `fn main() {
    // TODO: Define the 3x3 matrix using vec![]
    
    // TODO: Check connection between 0 and 1
}`,
        solutionCode: `fn main() {
    let graph = vec![
        vec![0, 1, 0],
        vec![1, 0, 1],
        vec![0, 1, 0]
    ];
    
    if graph[0][1] == 1 {
        println!("Node 0 is connected to Node 1");
    } else {
        println!("No connection");
    }
}`
    },
    {
        id: "ai-info-entropy",
        title: "Info Theory: Entropy",
        description: "Measuring uncertainty and information.",
        content: `## Entropy
        
**Entropy** ($H$) measures the unpredictability of a system. High entropy means "very random" (fair coin). Low entropy means "predictable" (biased coin).

For a binary event (p, 1-p), the formula is:
$$ H(p) = - [ p \\log_2(p) + (1-p) \\log_2(1-p) ] $$

### Task
1. Given $p = 0.5$ (Fair coin).
2. Calculate entropy. (Hint: $\\log_2(0.5) = -1$).
3. Result should be 1.0 bit.`,
        initialCode: `fn main() {
    let p = 0.5;
    
    // TODO: Calculate entropy formula
    // Note: Use 0.5 log2 0.5 ...
}`,
        solutionCode: `fn main() {
    let p = 0.5;
    // In Rust, f64.log2() calculates base-2 logarithm
    let entropy = - (p * p.log2() + (1.0 - p) * (1.0 - p).log2());
    
    println!("Entropy of fair coin: {:.1} bits", entropy);
}`
    }
];

// CYBER WARFARE MODULES
const WARFARE_MODULES: CourseModule[] = [
    {
        id: "system-infiltration",
        title: "System Infiltration",
        description: "Breach the mainframe security protocols.",
        content: "SIMULATION_MODE",
        initialCode: "",
        solutionCode: ""
    }
];

export const COURSE_TRACKS: CourseTrack[] = [
    {
        id: "fundamentals",
        title: "Rust Programming",
        description: "Master the basics of Rust programming.",
        icon: "🦀",
        modules: FUNDAMENTALS_MODULES
    },
    {
        id: "data-science",
        title: "Data Science",
        description: "Analyze and manipulate data with Rust.",
        icon: "📊",
        modules: DS_MODULES
    },
    {
        id: "data-analytics",
        title: "Data Analytics",
        description: "Statistical analysis and reporting.",
        icon: "📈",
        modules: DA_MODULES
    },
    {
        id: "machine-learning",
        title: "Machine Learning",
        description: "Build logic and prediction models.",
        icon: "🧠",
        modules: ML_MODULES
    },
    {
        id: "ai",
        title: "Artificial Intelligence",
        description: "Deep learning and neural networks.",
        icon: "🤖",
        modules: AI_MODULES
    },
    {
        id: "cloud-computing",
        title: "Cloud Computing",
        description: "Scalable backend and serverless Rust.",
        icon: "☁️",
        modules: CLOUD_MODULES
    },
    {
        id: "ai-math",
        title: "AI Mathematics",
        description: "Essential math for Artificial Intelligence.",
        icon: "📐",
        modules: AI_MATH_MODULES
    }
];

// Flatten all modules for compatibility with existing routing
export const ALL_MODULES = [...FUNDAMENTALS_MODULES, ...DS_MODULES, ...DA_MODULES, ...ML_MODULES, ...AI_MODULES, ...CLOUD_MODULES, ...AI_MATH_MODULES, ...WARFARE_MODULES];
export const COURSE_MODULES: CourseModule[] = COURSE_TRACKS.flatMap(track => track.modules);
