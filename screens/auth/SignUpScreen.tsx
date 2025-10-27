// import { DarkTheme, LightTheme } from '@/constants/theme';
// import { useAuth } from '@/contexts/AuthContext';
// import { useLanguage } from '@/contexts/LanguageContext';
// import { useTheme } from '@/contexts/Theme';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import React, { useState } from 'react';
// import {
//     Alert,
//     Image,
//     KeyboardAvoidingView,
//     Platform,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from 'react-native';

// interface SignUpScreenProps {
//   onSwitchToLogin: () => void;
// }

// export default function SignUpScreen({ onSwitchToLogin }: SignUpScreenProps) {
//   const { theme } = useTheme();
//   const { t } = useLanguage();
//   const { signUpWithEmail, signInWithGoogle, loading } = useAuth();
//   const currentTheme = theme === 'dark' ? DarkTheme : LightTheme;

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleEmailSignUp = async () => {
//     if (!name || !email || !password || !confirmPassword) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match');
//       return;
//     }

//     if (password.length < 6) {
//       Alert.alert('Error', 'Password must be at least 6 characters');
//       return;
//     }

//     try {
//       await signUpWithEmail(email, password, name);
//     } catch (error) {
//       console.error('Sign up error:', error);
//     }
//   };

//   const handleGoogleSignUp = async () => {
//     try {
//       await signInWithGoogle();
//     } catch (error) {
//       console.error('Google sign up error:', error);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={[styles.container, { backgroundColor: currentTheme.background }]}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Image
//             source={require('../../assets/images/logo.jpg')}
//             style={styles.logo}
//             resizeMode="contain"
//           />
//           <Text style={[styles.title, { color: currentTheme.text }]}>
//             {t('auth.createAccount')}
//           </Text>
//           <Text style={[styles.subtitle, { color: currentTheme.secondaryText }]}>
//             {t('auth.joinUsToday')}
//           </Text>
//         </View>

//         {/* Form */}
//         <View style={styles.form}>
//           {/* Name Input */}
//           <View style={styles.inputContainer}>
//             <MaterialCommunityIcons
//               name="account-outline"
//               size={20}
//               color={currentTheme.secondaryText}
//               style={styles.inputIcon}
//             />
//             <TextInput
//               style={[styles.input, { color: currentTheme.text, borderColor: currentTheme.secondaryText }]}
//               placeholder={t('auth.fullName')}
//               placeholderTextColor={currentTheme.secondaryText}
//               value={name}
//               onChangeText={setName}
//               autoCapitalize="words"
//             />
//           </View>

//           {/* Email Input */}
//           <View style={styles.inputContainer}>
//             <MaterialCommunityIcons
//               name="email-outline"
//               size={20}
//               color={currentTheme.secondaryText}
//               style={styles.inputIcon}
//             />
//             <TextInput
//               style={[styles.input, { color: currentTheme.text, borderColor: currentTheme.secondaryText }]}
//               placeholder={t('auth.email')}
//               placeholderTextColor={currentTheme.secondaryText}
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//               autoCorrect={false}
//             />
//           </View>

//           {/* Password Input */}
//           <View style={styles.inputContainer}>
//             <MaterialCommunityIcons
//               name="lock-outline"
//               size={20}
//               color={currentTheme.secondaryText}
//               style={styles.inputIcon}
//             />
//             <TextInput
//               style={[styles.input, { color: currentTheme.text, borderColor: currentTheme.secondaryText }]}
//               placeholder={t('auth.password')}
//               placeholderTextColor={currentTheme.secondaryText}
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry={!showPassword}
//             />
//             <TouchableOpacity
//               onPress={() => setShowPassword(!showPassword)}
//               style={styles.eyeIcon}
//             >
//               <MaterialCommunityIcons
//                 name={showPassword ? 'eye-off' : 'eye'}
//                 size={20}
//                 color={currentTheme.secondaryText}
//               />
//             </TouchableOpacity>
//           </View>

//           {/* Confirm Password Input */}
//           <View style={styles.inputContainer}>
//             <MaterialCommunityIcons
//               name="lock-check-outline"
//               size={20}
//               color={currentTheme.secondaryText}
//               style={styles.inputIcon}
//             />
//             <TextInput
//               style={[styles.input, { color: currentTheme.text, borderColor: currentTheme.secondaryText }]}
//               placeholder={t('auth.confirmPassword')}
//               placeholderTextColor={currentTheme.secondaryText}
//               value={confirmPassword}
//               onChangeText={setConfirmPassword}
//               secureTextEntry={!showConfirmPassword}
//             />
//             <TouchableOpacity
//               onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//               style={styles.eyeIcon}
//             >
//               <MaterialCommunityIcons
//                 name={showConfirmPassword ? 'eye-off' : 'eye'}
//                 size={20}
//                 color={currentTheme.secondaryText}
//               />
//             </TouchableOpacity>
//           </View>

//           {/* Terms and Conditions */}
//           <View style={styles.termsContainer}>
//             <Text style={[styles.termsText, { color: currentTheme.secondaryText }]}>
//               {t('auth.agreeToTerms')}
//             </Text>
//             <TouchableOpacity>
//               <Text style={[styles.termsLink, { color: currentTheme.accent }]}>
//                 {t('auth.termsAndConditions')}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Sign Up Button */}
//           <TouchableOpacity
//             style={[styles.signUpButton, { backgroundColor: currentTheme.accent }]}
//             onPress={handleEmailSignUp}
//             disabled={loading}
//           >
//             <Text style={styles.signUpButtonText}>
//               {loading ? t('common.loading') : t('auth.signUp')}
//             </Text>
//           </TouchableOpacity>

//           {/* Divider */}
//           <View style={styles.divider}>
//             <View style={[styles.dividerLine, { backgroundColor: currentTheme.secondaryText }]} />
//             <Text style={[styles.dividerText, { color: currentTheme.secondaryText }]}>
//               {t('auth.or')}
//             </Text>
//             <View style={[styles.dividerLine, { backgroundColor: currentTheme.secondaryText }]} />
//           </View>

//           {/* Google Sign Up */}
//           <TouchableOpacity
//             style={[styles.googleButton, { borderColor: currentTheme.secondaryText }]}
//             onPress={handleGoogleSignUp}
//             disabled={loading}
//           >
//             <MaterialCommunityIcons name="google" size={20} color="#4285F4" />
//             <Text style={[styles.googleButtonText, { color: currentTheme.text }]}>
//               {t('auth.signUpWithGoogle')}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Login Link */}
//         <View style={styles.loginContainer}>
//           <Text style={[styles.loginText, { color: currentTheme.secondaryText }]}>
//             {t('auth.alreadyHaveAccount')}
//           </Text>
//           <TouchableOpacity onPress={onSwitchToLogin}>
//             <Text style={[styles.loginLink, { color: currentTheme.accent }]}>
//               {t('auth.signIn')}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 24,
//     paddingVertical: 40,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   logo: {
//     width: 80,
//     height: 80,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   form: {
//     marginBottom: 30,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     position: 'relative',
//   },
//   inputIcon: {
//     position: 'absolute',
//     left: 16,
//     zIndex: 1,
//   },
//   input: {
//     flex: 1,
//     height: 56,
//     borderWidth: 1,
//     borderRadius: 12,
//     paddingLeft: 50,
//     paddingRight: 16,
//     fontSize: 16,
//   },
//   eyeIcon: {
//     position: 'absolute',
//     right: 16,
//     zIndex: 1,
//   },
//   termsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 24,
//     alignItems: 'center',
//   },
//   termsText: {
//     fontSize: 14,
//   },
//   termsLink: {
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   signUpButton: {
//     height: 56,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   signUpButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   divider: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//   },
//   dividerText: {
//     marginHorizontal: 16,
//     fontSize: 14,
//   },
//   googleButton: {
//     height: 56,
//     borderWidth: 1,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 12,
//   },
//   googleButtonText: {
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   loginContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loginText: {
//     fontSize: 14,
//   },
//   loginLink: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 4,
//   },
// });
