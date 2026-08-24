import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  actionText: string;
  icon: string;
}

interface StarterTemplate {
  id: string;
  name: string;
  icon: string;
  category: string;
  theme: 'lime' | 'peach' | 'purple' | 'zinc';
  description: string;
  recommendedRole: string;
}

interface Task {
  id: number;
  title: string;
  project: string;
  status: 'up_next' | 'in_motion' | 'done';
  tag: string;
  tagTheme: 'lime' | 'peach' | 'purple' | 'zinc';
  assignedTo: string;
  dueDate: string;
  completed: boolean;
}

interface Project {
  id: string;
  name: string;
  category: string;
  status: 'Active' | 'In Review' | 'Planning';
  progress: number;
  members: { name: string; initials: string; color: string }[];
  taskCount: number;
  completedTasks: number;
  dueDate: string;
  theme: 'lime' | 'peach' | 'purple' | 'zinc';
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  // First-time user workspace state (starts as false for new accounts)
  hasWorkspace: boolean = false;
  currentWorkspaceName: string = '';
  newWorkspaceInput: string = '';
  newWorkspaceCategory: string = 'Growth & Strategy';

  searchQuery: string = '';
  activeTab: 'all' | 'mine' | 'today' = 'all';
  quickTaskTitle: string = '';
  quickTaskCategory: string = 'Design';

  showCreateWorkspaceModal: boolean = false;
  showNewTaskModal: boolean = false;
  showWorkspaceMenu: boolean = false;
  showInviteModal: boolean = false;
  workspaceCreatedJustNow: boolean = false;

  inviteEmail: string = '';
  inviteSent: boolean = false;

  // Onboarding Steps State
  onboardingSteps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Create your workspace',
      description: 'Name your team workspace or pick a template',
      completed: false,
      actionText: 'Create Now',
      icon: '✦'
    },
    {
      id: 2,
      title: 'Choose a starter template',
      description: 'Pick a template below to pre-fill tasks & roadmap views',
      completed: false,
      actionText: 'Pick Template',
      icon: '🚀'
    },
    {
      id: 3,
      title: 'Add your first task or goal',
      description: 'Click + New Task in the header or check off a sample task',
      completed: false,
      actionText: '+ Add Task',
      icon: '✏️'
    },
    {
      id: 4,
      title: 'Invite team members',
      description: 'Work is better together. Share a link or invite via email',
      completed: false,
      actionText: 'Invite Team',
      icon: '🤝'
    }
  ];

  // Templates for First Time Setup
  starterTemplates: StarterTemplate[] = [
    {
      id: 't1',
      name: 'Product Launch Roadmap',
      icon: '🚀',
      category: 'Growth & Strategy',
      theme: 'purple',
      description: 'Everything needed from campaign strategy and press release to launch day checklist.',
      recommendedRole: 'Product & Marketing'
    },
    {
      id: 't2',
      name: 'Design System Orbit UI',
      icon: '🎨',
      category: 'Design & Tokens',
      theme: 'lime',
      description: 'Organize components, color palettes, typography tokens, and micro-interactions.',
      recommendedRole: 'Design & Frontend'
    },
    {
      id: 't3',
      name: 'Agile Sprint & Backlog',
      icon: '📋',
      category: 'Engineering',
      theme: 'peach',
      description: 'Simple 3-column kanban workflow for tracking features, bugs, and release milestones.',
      recommendedRole: 'Engineering Teams'
    },
    {
      id: 't4',
      name: 'Team Rituals & Notes',
      icon: '🤝',
      category: 'Operations',
      theme: 'zinc',
      description: 'Asynchronous updates handbook, weekly focus alignment, and meeting agendas.',
      recommendedRole: 'All Teams'
    }
  ];

  // Active Projects list
  projects: Project[] = [];

  // Active Tasks list
  tasks: Task[] = [];

  get completedStepsCount(): number {
    return this.onboardingSteps.filter(s => s.completed).length;
  }

  get onboardingProgressPercent(): number {
    return Math.round((this.completedStepsCount / this.onboardingSteps.length) * 100);
  }

  // Create Workspace Action
  createWorkspace(workspaceName?: string, template?: StarterTemplate) {
    const name = (workspaceName || this.newWorkspaceInput || 'Acme Studio').trim();
    this.currentWorkspaceName = name;
    this.hasWorkspace = true;
    this.workspaceCreatedJustNow = true;
    this.showCreateWorkspaceModal = false;

    // Update Step 1 complete
    const step1 = this.onboardingSteps.find(s => s.id === 1);
    if (step1) step1.completed = true;

    // Default starter project
    if (template) {
      this.useTemplate(template);
    } else {
      this.projects = [
        {
          id: 'p1',
          name: `${name} Workspace`,
          category: this.newWorkspaceCategory,
          status: 'Active',
          progress: 25,
          members: [
            { name: 'Alex M. (You)', initials: 'AM', color: 'bg-[#aea0ff] text-[#20211e]' },
            { name: 'Orbit Bot', initials: 'OB', color: 'bg-[#d7fb66] text-[#20211e]' }
          ],
          taskCount: 4,
          completedTasks: 1,
          dueDate: 'Today',
          theme: 'lime',
          description: 'Your interactive sandbox workspace to explore Orbit features and invite your team.'
        }
      ];

      this.tasks = [
        {
          id: 1,
          title: `Welcome to ${name}! Complete this task to get started`,
          project: `${name} Workspace`,
          status: 'up_next',
          tag: 'Tutorial',
          tagTheme: 'lime',
          assignedTo: 'Alex M.',
          dueDate: 'Today',
          completed: false
        },
        {
          id: 2,
          title: 'Use search to quickly jump between projects',
          project: `${name} Workspace`,
          status: 'up_next',
          tag: 'Pro Tip',
          tagTheme: 'purple',
          assignedTo: 'Alex M.',
          dueDate: 'Today',
          completed: false
        },
        {
          id: 3,
          title: 'Try creating a new project or select a starter template',
          project: `${name} Workspace`,
          status: 'in_motion',
          tag: 'Setup',
          tagTheme: 'peach',
          assignedTo: 'Alex M.',
          dueDate: 'Today',
          completed: false
        },
        {
          id: 4,
          title: 'Create account and set up first workspace',
          project: `${name} Workspace`,
          status: 'done',
          tag: 'System',
          tagTheme: 'zinc',
          assignedTo: 'Alex M.',
          dueDate: 'Done',
          completed: true
        }
      ];
    }

    setTimeout(() => {
      this.workspaceCreatedJustNow = false;
    }, 4000);
  }

  useTemplate(template: StarterTemplate) {
    if (!this.hasWorkspace) {
      this.newWorkspaceInput = `${template.name.split(' ')[0]} Studio`;
      this.createWorkspace(this.newWorkspaceInput, template);
      return;
    }

    const newProject: Project = {
      id: 'p_' + Date.now(),
      name: template.name,
      category: template.category,
      status: 'Active',
      progress: 15,
      members: [
        { name: 'Alex M.', initials: 'AM', color: 'bg-[#aea0ff] text-[#20211e]' }
      ],
      taskCount: 6,
      completedTasks: 1,
      dueDate: 'In 2 weeks',
      theme: template.theme,
      description: template.description
    };
    this.projects.push(newProject);

    // Add sample tasks for this project
    this.tasks.push({
      id: Date.now() + 1,
      title: `Kickoff ${template.name} planning & priorities`,
      project: template.name,
      status: 'up_next',
      tag: template.category.split(' ')[0],
      tagTheme: template.theme,
      assignedTo: 'Alex M.',
      dueDate: 'Tomorrow',
      completed: false
    });

    // Mark step 2 complete
    const step2 = this.onboardingSteps.find(s => s.id === 2);
    if (step2) step2.completed = true;
  }

  toggleOnboardingStep(stepId: number) {
    const step = this.onboardingSteps.find(s => s.id === stepId);
    if (step) {
      step.completed = !step.completed;
    }
  }

  toggleTask(id: number) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      task.status = task.completed ? 'done' : 'in_motion';

      // Auto check task step in onboarding if step 3 wasn't completed
      const step3 = this.onboardingSteps.find(s => s.id === 3);
      if (step3 && !step3.completed) {
        step3.completed = true;
      }
    }
  }

  get tasksUpNext() {
    return this.filteredTasksList().filter(t => t.status === 'up_next');
  }

  get tasksInMotion() {
    return this.filteredTasksList().filter(t => t.status === 'in_motion');
  }

  get tasksDone() {
    return this.filteredTasksList().filter(t => t.status === 'done');
  }

  filteredTasksList(): Task[] {
    return this.tasks.filter(task => {
      const matchesSearch = !this.searchQuery ||
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        task.project.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        task.tag.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesTab =
        this.activeTab === 'all' ||
        (this.activeTab === 'mine' && task.assignedTo === 'Alex M.') ||
        (this.activeTab === 'today' && task.dueDate.toLowerCase().includes('today'));

      return matchesSearch && matchesTab;
    });
  }

  createNewTask() {
    if (!this.quickTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      title: this.quickTaskTitle.trim(),
      project: this.currentWorkspaceName || 'My Workspace',
      status: 'up_next',
      tag: this.quickTaskCategory || 'Task',
      tagTheme: 'lime',
      assignedTo: 'Alex M.',
      dueDate: 'Today',
      completed: false
    };
    this.tasks.unshift(newTask);
    this.quickTaskTitle = '';
    this.showNewTaskModal = false;

    // Mark step 3 complete
    const step3 = this.onboardingSteps.find(s => s.id === 3);
    if (step3) step3.completed = true;
  }

  sendInvite() {
    if (this.inviteEmail.trim()) {
      this.inviteSent = true;
      this.inviteEmail = '';
      setTimeout(() => {
        this.inviteSent = false;
        this.showInviteModal = false;
      }, 2000);

      // Mark step 4 complete
      const step4 = this.onboardingSteps.find(s => s.id === 4);
      if (step4) step4.completed = true;
    }
  }
}


