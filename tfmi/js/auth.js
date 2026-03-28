let supabaseClient = null;
let authUnsubscribe = null;

function initAuth(supabaseUrl, supabaseAnonKey) {
    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Missing Supabase credentials');
        return;
    }

    supabaseClient = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
}

function listenForAuthChanges(onSignIn, onSignOut) {
    if (!supabaseClient) {
        console.error('Supabase client not initialized');
        return;
    }

    // Check initial session
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
        if (session) {
            onSignIn(session);
        }
    });

    // Listen for auth changes
    authUnsubscribe = supabaseClient.auth.onAuthStateChange((_event, session) => {
        if (session) {
            onSignIn(session);
        } else {
            onSignOut();
        }
    });
}

async function loginWith(provider) {
    if (!supabaseClient) {
        console.error('Supabase client not initialized');
        return;
    }

    const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: provider,
        options: {
            redirectTo: window.location.origin
        }
    });

    if (error) {
        console.error('Login error:', error);
    }
}

async function logout() {
    if (!supabaseClient) {
        console.error('Supabase client not initialized');
        return;
    }

    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        console.error('Logout error:', error);
    }
}
