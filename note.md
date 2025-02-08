# Data Transmission and Processing in Express

## Overview

When passing data over the network, it is transmitted as **streams** or **chunks**. HTTP accepts only **binary** or **text** data. The data is typically passed in **JSON** format, which is a **stringified** version of the data. To work with this data in a JavaScript-based server (like Express), we use `express.json()` to convert the incoming JSON string into a **JavaScript object** that can be easily accessed and manipulated.

### **Major Differences Between JSON and JavaScript Objects**

1. **Format**:

   - **JSON**: A **text-based** format used for **data interchange** (stringified).
   - **JavaScript Object**: A **live in-memory** data structure that can hold various data types including functions and Date objects.

2. **Data Types**:

   - **JSON**: Supports **only** strings, numbers, booleans, null, arrays, and objects.
   - **JavaScript Object**: Can include functions, `undefined`, `Date` objects, and more.

3. **Serialization**:

   - **JSON**: **Serialized** to a string using `JSON.stringify()`.
   - **JavaScript Object**: Stored directly in memory and can be manipulated directly.

4. **Mutability**:

   - **JSON**: Immutable once stringified. Needs to be **parsed** with `JSON.parse()` to modify.
   - **JavaScript Object**: Mutable, can be changed directly.

5. **Compatibility**:
   - **JSON**: Can be used across various languages for data exchange as it’s a **language-agnostic** format.
   - **JavaScript Object**: Only usable within JavaScript and needs to be **serialized** (e.g., into JSON) for use in other languages.

---

# MongoDB ObjectId and \_\_v (Version Key)

## **\_id (ObjectId)** in MongoDB

- **\_id** is a **unique identifier** automatically assigned to documents in MongoDB collections.
- **ObjectId** is a 12-byte identifier, represented as a **24-character hexadecimal string**.
- **Global Uniqueness**: Ensures every document has a unique identifier, even across distributed MongoDB instances.
- **Efficient Indexing**: The `_id` field is indexed by default, making queries using `_id` efficient.
- **Automatic Generation**: If no `_id` is provided, MongoDB generates an ObjectId automatically.

### Example:

```json
{
  "_id": "507f1f77bcf86cd799439011"
}
```

- The **`__v`** field is used by Mongoose to handle **optimistic concurrency control**.
- **Versioning**: Mongoose automatically increments the `__v` value each time a document is updated.
- **Concurrency Control**: Helps prevent **race conditions** by ensuring that updates to a document are only applied if the version matches the current version in the database.
- **Conflict Detection**: If the `__v` value has changed between the time the document was fetched and the time the update is attempted, Mongoose will reject the update, preventing data loss and overwriting of concurrent changes.

### Example:

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "__v": 1
}
```

---

# `app.all()` vs `app.use()` in Express

## `app.all()`

- `app.all()` is a route handler that handles all HTTP methods for a specific route.
- It processes the request and directly sends the response.
- It is the final step in handling the request.

## `app.use()`

- `app.use()` is middleware that runs before or after the route handler.
- It doesn’t send a response directly (unless explicitly done in the middleware itself).
- It is used for pre-processing the request, such as logging, validation, authentication, etc.

## Summary

- `app.all()` is a final route handler, while `app.use()` is middleware that runs before or after the actual route handler.

---

# PUT vs PATCH

## PUT

- **Full replacement of resource**: Use **PUT** when you want to replace the entire resource with a new one.
- **Idempotent**: Making the same **PUT** request multiple times will always have the same result.

## PATCH

- **Partial update to resource**: Use **PATCH** when you want to update only specific fields or part of the resource.
- **Not necessarily Idempotent**: Making the same **PATCH** request multiple times may have different results, depending on the server's handling.

### Quick Rule:

- **PUT** = Full replacement of resource.
- **PATCH** = Partial update to resource.

## Why should we expire cookie when logging out?

### What Happens Without `expires`?

- The cookie remains in the browser even if its value is `null` or `""`.
- The browser does not automatically delete session cookies unless instructed.
- The backend still receives `"token=null"` or `"token="`, which could cause a **"malformed JWT"** error.
- JWT middleware may attempt to verify the token and fail if the value is invalid.

### How `expires` Fixes It

When you set `expires: new Date(0)`, the browser **completely removes** the cookie, so:

- The client won’t send the cookie in future requests.
- The backend won’t even see `"token="`, preventing the "malformed JWT" issue.

### Conclusion

✅ **Without `expires`**, the cookie exists but contains an invalid value.  
✅ **With `expires`**, the cookie is truly removed, preventing JWT-related errors.

## 🚫 Disadvantages of Indexing All Fields in Mongoose

- **📦 Increased Storage Usage**

  - Indexes take up additional disk space, leading to higher storage costs.

- **🐌 Slower Write Operations**

  - Inserts, updates, and deletes become slower as all indexes need to be updated.

- **💾 High Memory Consumption**

  - Too many indexes consume more RAM, which can impact database performance.

- **🔍 Query Performance Issues**

  - The query planner may pick inefficient indexes, slowing down queries instead of optimizing them.

- **❌ Unnecessary Indexes**
  - Not all fields are queried frequently, making many indexes redundant.

### ✅ **Best Practices**

- Index only the fields frequently used in queries.
- Use **compound indexes** instead of separate indexes on individual fields.
