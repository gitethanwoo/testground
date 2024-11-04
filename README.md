# LLM Flow Builder

A visual tool for experimenting with and iterating on LLM (Large Language Model) prompt chains and flows.

## Why This Tool?

Building effective AI applications requires careful attention to:
- Prompt engineering and iteration
- Breaking down complex prompts into smaller, focused steps
- Managing data flow between different prompts
- Structured output handling

This tool makes this process faster and more intuitive by providing a visual interface for building and testing LLM flows.

## Key Features

### 🧱 Modular Blocks
- **Input Blocks**: Define variables and prompts
- **Generate Blocks**: Create LLM-powered transformations
- Chain blocks together to create complex flows

### 🔄 Rapid Iteration
- Real-time testing of individual blocks
- Execute entire flows with one click
- Quick adjustments to prompts and settings

### 📊 Structured Data Handling
- Toggle between unstructured text and JSON outputs
- Define custom object shapes for structured responses
- Seamlessly pass data between blocks

### ⚡ Efficient Workflow
- Keyboard shortcuts for common actions
- Reference previous blocks' outputs
- Visual feedback for execution status

## Example Use Case: Meeting Intelligence Pipeline

Here's a practical example of how to transform a raw meeting transcript into useful formats, using simple, flat structures:

1. **Input Block**: Raw Grain/Otter.ai transcript
   ```typescript
   // Input format: plain text
   "Speaker 1 (00:00): Hey team, let's discuss the Q4 roadmap...
    Speaker 2 (00:15): I think we should prioritize the API redesign..."
   ```

2. **Generate Block 1**: Speaker Message Extraction
   ```typescript
   // Output shape: Array of simple messages
   [
     {
       speaker: "Speaker 1",
       message: "Hey team, let's discuss the Q4 roadmap"
     },
     {
       speaker: "Speaker 2",
       message: "I think we should prioritize the API redesign"
     }
   ]
   ```

3. **Generate Block 2**: Topic List
   ```typescript
   // Output shape: Array of topics
   [
     "Q4 Planning",
     "API Redesign",
     "Resource Allocation",
     "Timeline Discussion"
   ]
   ```

4. **Generate Block 3**: Action Items
   ```typescript
   // Output shape: Array of tasks
   [
     {
       task: "Schedule API design review",
       owner: "John",
       deadline: "Next Friday"
     },
     {
       task: "Create resource allocation doc",
       owner: "Sarah",
       deadline: "Tomorrow"
     }
   ]
   ```

5. **Generate Block 4**: Key Takeaways
   ```typescript
   // Output shape: Simple object with flat parameters
   {
     mainDecision: "Team will prioritize API redesign in Q4",
     nextStep: "Schedule design review meeting",
     followupDate: "Next Monday",
     priority: "High"
   }
   ```

Each block uses one of the supported output types:
- Simple arrays of strings
- Arrays of flat objects
- Single objects with flat parameters

This flow demonstrates how to break down complex meeting analysis into simple, manageable steps that work within the current constraints of the tool.
