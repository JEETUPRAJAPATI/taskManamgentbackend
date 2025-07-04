import mongoose from 'mongoose';

// Organization Schema
const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: String,
  logo: String,
  maxUsers: {
    type: Number,
    default: 10
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  firstName: {
    type: String,
    trim: true,
    required: function () {
      return this.status === 'active';
    }
  },
  lastName: {
    type: String,
    trim: true,
    required: function () {
      return this.status === 'active';
    }
  },
  profileImageUrl: String,
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true,
    maxlength: 200
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500
  },
  passwordHash: {
    type: String,
    required: function () {
      return this.status === 'active';
    }
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  role: {
    type: String,
    enum: ['superadmin', 'org_admin', 'admin', 'individual', 'employee', 'member'],
    default: 'employee',
    required: true
  },
  permissions: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['pending', 'invited', 'active', 'inactive', 'suspended'],
    default: 'pending'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  inviteToken: String,
  inviteTokenExpiry: Date,
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  invitedAt: Date,
  lastLoginAt: Date,
  preferences: {
    type: Object,
    default: {}
  },
  // Legacy fields for backward compatibility
  roles: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Project Schema
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'completed'],
    default: 'active'
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  settings: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

// Task Status Schema
const taskStatusSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    default: '#6B7280'
  },
  order: {
    type: Number,
    default: 0
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Task Schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'review', 'completed'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  dueDate: Date,
  completedAt: Date,
  tags: [{
    type: String,
    trim: true
  }],
  metadata: {
    type: Object,
    default: {}
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringConfig: Object,
  parentTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  order: {
    type: Number,
    default: 0
  },
  estimatedHours: Number,
  actualHours: Number
}, {
  timestamps: true
});

// Task Comment Schema
const taskCommentSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    mimeType: String
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date
}, {
  timestamps: true
});

// Task Assignment Schema
const taskAssignmentSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedAt: {
    type: Date,
    default: Date.now
  }
});

// Task Audit Log Schema
const taskAuditLogSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  oldValues: Object,
  newValues: Object,
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: String,
  data: {
    type: Object,
    default: {}
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  sentViaEmail: {
    type: Boolean,
    default: false
  },
  emailSentAt: Date
}, {
  timestamps: true
});

// Usage Tracking Schema
const usageTrackingSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  month: {
    type: String,
    required: true
  },
  activeUsers: {
    type: Number,
    default: 0
  },
  tasksCreated: {
    type: Number,
    default: 0
  },
  tasksCompleted: {
    type: Number,
    default: 0
  },
  commentsPosted: {
    type: Number,
    default: 0
  },
  storageUsed: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create indexes
organizationSchema.index({ slug: 1 });
userSchema.index({ email: 1 });
userSchema.index({ organization: 1 });
taskSchema.index({ organization: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ status: 1 });
taskCommentSchema.index({ task: 1 });
notificationSchema.index({ user: 1, isRead: 1 });
usageTrackingSchema.index({ organization: 1, month: 1 }, { unique: true });

// Export models
// Form Schema
const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fields: [{
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['text', 'date', 'dropdown', 'multiselect', 'number', 'textarea', 'email', 'phone']
    },
    label: {
      type: String,
      required: true
    },
    placeholder: String,
    required: {
      type: Boolean,
      default: false
    },
    options: [String], // For dropdown and multiselect
    validation: {
      min: Number,
      max: Number,
      pattern: String
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  accessLink: {
    type: String,
    unique: true,
    sparse: true
  },
  settings: {
    allowAnonymous: {
      type: Boolean,
      default: true
    },
    maxSubmissions: Number,
    submitMessage: {
      type: String,
      default: 'Thank you for your submission!'
    },
    redirectUrl: String
  }
}, {
  timestamps: true
});

// Process Flow Schema
const processFlowSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  steps: [{
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    type: {
      type: String,
      required: true,
      enum: ['task', 'approval', 'notification', 'conditional']
    },
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    dueInDays: Number,
    conditions: [{
      field: String,
      operator: {
        type: String,
        enum: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than']
      },
      value: String
    }],
    nextSteps: [String], // Array of step IDs
    order: {
      type: Number,
      default: 0
    }
  }],
  flowType: {
    type: String,
    required: true,
    enum: ['sequential', 'parallel', 'conditional'],
    default: 'sequential'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Form Response Schema
const formResponseSchema = new mongoose.Schema({
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  processFlow: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProcessFlow'
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  submitterEmail: String, // For anonymous submissions
  responses: [{
    fieldId: {
      type: String,
      required: true
    },
    fieldLabel: String,
    value: mongoose.Schema.Types.Mixed
  }],
  status: {
    type: String,
    enum: ['submitted', 'in_progress', 'completed', 'rejected'],
    default: 'submitted'
  },
  currentStep: String, // Current step ID in process flow
  stepHistory: [{
    stepId: String,
    stepTitle: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'rejected', 'skipped']
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comments: String,
    completedAt: Date
  }],
  metadata: {
    ipAddress: String,
    userAgent: String,
    referrer: String
  }
}, {
  timestamps: true
});

// Process Instance Schema (for tracking workflow execution)
const processInstanceSchema = new mongoose.Schema({
  processFlow: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProcessFlow',
    required: true
  },
  formResponse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FormResponse',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'terminated', 'paused'],
    default: 'active'
  },
  currentSteps: [String], // Current active step IDs
  completedSteps: [String], // Completed step IDs
  variables: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

export const Organization = mongoose.model('Organization', organizationSchema);
export const User = mongoose.model('User', userSchema);
export const Project = mongoose.model('Project', projectSchema);
export const TaskStatus = mongoose.model('TaskStatus', taskStatusSchema);
export const Task = mongoose.model('Task', taskSchema);
export const TaskComment = mongoose.model('TaskComment', taskCommentSchema);
export const TaskAssignment = mongoose.model('TaskAssignment', taskAssignmentSchema);
export const TaskAuditLog = mongoose.model('TaskAuditLog', taskAuditLogSchema);
export const Notification = mongoose.model('Notification', notificationSchema);
export const UsageTracking = mongoose.model('UsageTracking', usageTrackingSchema);
export const Form = mongoose.model('Form', formSchema);
export const ProcessFlow = mongoose.model('ProcessFlow', processFlowSchema);
export const FormResponse = mongoose.model('FormResponse', formResponseSchema);
export const ProcessInstance = mongoose.model('ProcessInstance', processInstanceSchema);

// Pending User Schema for email verification during registration
const pendingUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  type: { type: String, enum: ['individual', 'organization'], required: true },
  organizationName: { type: String }, // Only for organization type
  organizationSlug: { type: String }, // Only for organization type
  verificationCode: { type: String },
  verificationExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: Date.now, expires: 86400 } // 24 hours
});

export const PendingUser = mongoose.model('PendingUser', pendingUserSchema);