# Api documentation
<details>
    <summary>
        <strong style="color:green;">GET</strong> /products
    </summary>

* it returns status <strong style="color:green;">200</strong> for success with an object array like this:
   
```json
 [ 
    {
        "id":1,
        "name":"coffee",
        "category":"drink",
        "stock_total":10,
        "image":"URL",
        "price":2.99
    }
    {
        "id":2,
        "name":"mentos",
        "category":"gum",
        "stock_total":8,
        "image":"URL",
        "price":1.99
    }
 ]
```
* it returns status <strong style="color:green;">204</strong> for success but no content</li>
    
</details>
